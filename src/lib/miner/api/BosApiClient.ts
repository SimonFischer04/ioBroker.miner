import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'node:path';
import type { ProtoGrpcType as ActionsProtoGrpcType } from '../../generated/bos-api/types/actions';
import type { ProtoGrpcType as AuthenticationProtoGrpcType } from '../../generated/bos-api/types/authentication';
import type { ProtoGrpcType as MinerProtoGrpcType } from '../../generated/bos-api/types/miner';
import type { ProtoGrpcType as VersionProtoGrpcType } from '../../generated/bos-api/types/version';
import type { ActionsServiceClient } from '../../generated/bos-api/types/braiins/bos/v1/ActionsService';
import type { AuthenticationServiceClient } from '../../generated/bos-api/types/braiins/bos/v1/AuthenticationService';
import type { MinerServiceClient } from '../../generated/bos-api/types/braiins/bos/v1/MinerService';
import type { ApiVersionServiceClient } from '../../generated/bos-api/types/braiins/bos/ApiVersionService';
import type { GetMinerDetailsResponse__Output } from '../../generated/bos-api/types/braiins/bos/v1/GetMinerDetailsResponse';
import type { GetMinerStatsResponse__Output } from '../../generated/bos-api/types/braiins/bos/v1/GetMinerStatsResponse';
import type { LoginResponse__Output } from '../../generated/bos-api/types/braiins/bos/v1/LoginResponse';
import type { ApiVersion__Output } from '../../generated/bos-api/types/braiins/bos/ApiVersion';

export type BosMinerDetails = GetMinerDetailsResponse__Output;
export type BosMinerStats = GetMinerStatsResponse__Output;
export type BosLoginResponse = LoginResponse__Output;
export type BosApiVersion = ApiVersion__Output;

/**
 *
 */
export interface BosApiClientOptions {
    /**
     *
     */
    host: string;
    /**
     *
     */
    port: number;
    /**
     *
     */
    secure?: boolean;
    /**
     *
     */
    timeoutMs?: number;
    /**
     *
     */
    username?: string;
    /**
     *
     */
    password?: string;
}

type UnaryClientMethod<Request, Response> = (
    request: Request,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<Response>,
) => grpc.ClientUnaryCall;

const PROTO_ROOT = path.join(__dirname, '../../generated/bos-api/proto');
const PROTO_FILES = [
    path.join(PROTO_ROOT, 'bos/version.proto'),
    path.join(PROTO_ROOT, 'bos/v1/actions.proto'),
    path.join(PROTO_ROOT, 'bos/v1/authentication.proto'),
    path.join(PROTO_ROOT, 'bos/v1/miner.proto'),
];

function loadBosPackage(): ActionsProtoGrpcType &
    AuthenticationProtoGrpcType &
    MinerProtoGrpcType &
    VersionProtoGrpcType {
    const packageDefinition = protoLoader.loadSync(PROTO_FILES, {
        includeDirs: [PROTO_ROOT],
        longs: Number,
        enums: Number,
        defaults: false,
        oneofs: true,
    });

    return grpc.loadPackageDefinition(packageDefinition) as unknown as ActionsProtoGrpcType &
        AuthenticationProtoGrpcType &
        MinerProtoGrpcType &
        VersionProtoGrpcType;
}

function unary<Request extends object, Response>(
    method: UnaryClientMethod<Request, Response>,
    request: Request,
    timeoutMs?: number,
    metadata: grpc.Metadata = new grpc.Metadata(),
): Promise<Response> {
    return unaryWithMetadata(method, request, timeoutMs, metadata).then(result => result.response);
}

function unaryWithMetadata<Request extends object, Response>(
    method: UnaryClientMethod<Request, Response>,
    request: Request,
    timeoutMs?: number,
    metadata: grpc.Metadata = new grpc.Metadata(),
): Promise<{ response: Response; metadata: grpc.Metadata }> {
    const options: grpc.CallOptions = timeoutMs ? { deadline: new Date(Date.now() + timeoutMs) } : {};

    return new Promise((resolve, reject) => {
        let responseMetadata = new grpc.Metadata();
        const call = method(request, metadata, options, (error, response) => {
            if (error) {
                reject(error);
                return;
            }

            if (!response) {
                reject(new Error('BOS API returned an empty response'));
                return;
            }

            resolve({ response, metadata: responseMetadata });
        });
        call.on('metadata', metadata => {
            responseMetadata = metadata;
        });
    });
}

/**
 *
 */
export class BosApiClient {
    private readonly minerService: MinerServiceClient;
    private readonly actionsService: ActionsServiceClient;
    private readonly authenticationService: AuthenticationServiceClient;
    private readonly apiVersionService: ApiVersionServiceClient;
    private readonly timeoutMs: number | undefined;
    private readonly username: string | undefined;
    private readonly password: string | undefined;
    private token: string | undefined;
    private tokenRefreshDeadline = 0;
    private tokenTimeoutMs = 3_600_000;

    /**
     *
     * @param options
     */
    public constructor(options: BosApiClientOptions) {
        const credentials = options.secure ? grpc.credentials.createSsl() : grpc.credentials.createInsecure();
        const target = `${options.host}:${options.port}`;
        const bosPackage = loadBosPackage();

        this.timeoutMs = options.timeoutMs;
        this.username = options.username;
        this.password = options.password;
        this.minerService = new bosPackage.braiins.bos.v1.MinerService(target, credentials);
        this.actionsService = new bosPackage.braiins.bos.v1.ActionsService(target, credentials);
        this.authenticationService = new bosPackage.braiins.bos.v1.AuthenticationService(target, credentials);
        this.apiVersionService = new bosPackage.braiins.bos.ApiVersionService(target, credentials);
    }

    /**
     *
     */
    public async login(): Promise<BosLoginResponse> {
        if (this.username === undefined || this.password === undefined) {
            throw new Error('BOS API username and password are required for authentication');
        }

        const { response, metadata } = await unaryWithMetadata<
            { username: string; password: string },
            BosLoginResponse
        >(
            this.authenticationService.login.bind(this.authenticationService),
            { username: this.username, password: this.password },
            this.timeoutMs,
        );
        const token = getStringMetadataValue(metadata, 'authorization');

        if (!token) {
            throw new Error('BOS API login returned no authorization token');
        }

        this.token = token;
        this.tokenTimeoutMs = Math.max((response.timeoutS ?? 3600) - 5, 1) * 1000;
        this.refreshTokenDeadline();
        return response;
    }

    /**
     *
     */
    public getMinerDetails(): Promise<BosMinerDetails> {
        return this.authenticatedUnary(
            'MinerService.GetMinerDetails',
            this.minerService.getMinerDetails.bind(this.minerService),
            {},
        );
    }

    /**
     *
     */
    public getMinerStats(): Promise<BosMinerStats> {
        return this.authenticatedUnary(
            'MinerService.GetMinerStats',
            this.minerService.getMinerStats.bind(this.minerService),
            {},
        );
    }

    /**
     *
     */
    public getApiVersion(): Promise<BosApiVersion> {
        return this.authenticatedUnary(
            'ApiVersionService.GetApiVersion',
            this.apiVersionService.getApiVersion.bind(this.apiVersionService),
            {},
        );
    }

    /**
     *
     */
    public start(): Promise<object> {
        return this.authenticatedUnary('ActionsService.Start', this.actionsService.start.bind(this.actionsService), {});
    }

    /**
     *
     */
    public stop(): Promise<object> {
        return this.authenticatedUnary('ActionsService.Stop', this.actionsService.stop.bind(this.actionsService), {});
    }

    /**
     *
     */
    public pauseMining(): Promise<object> {
        return this.authenticatedUnary(
            'ActionsService.PauseMining',
            this.actionsService.pauseMining.bind(this.actionsService),
            {},
        );
    }

    /**
     *
     */
    public resumeMining(): Promise<object> {
        return this.authenticatedUnary(
            'ActionsService.ResumeMining',
            this.actionsService.resumeMining.bind(this.actionsService),
            {},
        );
    }

    /**
     *
     */
    public reboot(): Promise<object> {
        return this.authenticatedUnary(
            'ActionsService.Reboot',
            this.actionsService.reboot.bind(this.actionsService),
            {},
        );
    }

    /**
     *
     */
    public close(): void {
        this.minerService.close();
        this.actionsService.close();
        this.authenticationService.close();
        this.apiVersionService.close();
    }

    private async authenticatedUnary<Request extends object, Response>(
        methodName: string,
        method: UnaryClientMethod<Request, Response>,
        request: Request,
    ): Promise<Response> {
        await this.ensureAuthenticated();

        if (!this.token) {
            return unary(method, request, this.timeoutMs);
        }

        try {
            const response = await unary(method, request, this.timeoutMs, this.createAuthMetadata());
            this.refreshTokenDeadline();
            return response;
        } catch (error) {
            if (!isUnauthenticatedError(error)) {
                throw error;
            }

            this.token = undefined;
            await this.ensureAuthenticated();

            try {
                const response = await unary(method, request, this.timeoutMs, this.createAuthMetadata());
                this.refreshTokenDeadline();
                return response;
            } catch (retryError) {
                if (isUnauthenticatedError(retryError)) {
                    const message = retryError instanceof Error ? retryError.message : String(retryError);
                    throw new Error(`${methodName} failed authentication: ${message}`);
                }
                throw retryError;
            }
        }
    }

    private async ensureAuthenticated(): Promise<void> {
        if (!this.username && !this.password) {
            return;
        }

        if (!this.token || Date.now() >= this.tokenRefreshDeadline) {
            await this.login();
        }
    }

    private createAuthMetadata(): grpc.Metadata {
        const metadata = new grpc.Metadata();
        if (this.token) {
            metadata.set('authorization', this.token);
        }

        return metadata;
    }

    private refreshTokenDeadline(): void {
        this.tokenRefreshDeadline = Date.now() + this.tokenTimeoutMs;
    }
}

function isUnauthenticatedError(error: unknown): boolean {
    return error instanceof Error && 'code' in error && error.code === grpc.status.UNAUTHENTICATED;
}

function getStringMetadataValue(metadata: grpc.Metadata, key: string): string | undefined {
    const value = metadata.get(key)[0];
    if (typeof value === 'string') {
        return value;
    }
    return value?.toString('utf8');
}
