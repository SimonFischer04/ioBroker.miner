import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { ApplyContractKeyRequest as _braiins_bos_v1_ApplyContractKeyRequest, ApplyContractKeyRequest__Output as _braiins_bos_v1_ApplyContractKeyRequest__Output } from './braiins/bos/v1/ApplyContractKeyRequest';
import type { ApplyContractKeyResponse as _braiins_bos_v1_ApplyContractKeyResponse, ApplyContractKeyResponse__Output as _braiins_bos_v1_ApplyContractKeyResponse__Output } from './braiins/bos/v1/ApplyContractKeyResponse';
import type { BasesPoints as _braiins_bos_v1_BasesPoints, BasesPoints__Output as _braiins_bos_v1_BasesPoints__Output } from './braiins/bos/v1/BasesPoints';
import type { ExpiredLicense as _braiins_bos_v1_ExpiredLicense, ExpiredLicense__Output as _braiins_bos_v1_ExpiredLicense__Output } from './braiins/bos/v1/ExpiredLicense';
import type { Frequency as _braiins_bos_v1_Frequency, Frequency__Output as _braiins_bos_v1_Frequency__Output } from './braiins/bos/v1/Frequency';
import type { GetLicenseStateRequest as _braiins_bos_v1_GetLicenseStateRequest, GetLicenseStateRequest__Output as _braiins_bos_v1_GetLicenseStateRequest__Output } from './braiins/bos/v1/GetLicenseStateRequest';
import type { GetLicenseStateResponse as _braiins_bos_v1_GetLicenseStateResponse, GetLicenseStateResponse__Output as _braiins_bos_v1_GetLicenseStateResponse__Output } from './braiins/bos/v1/GetLicenseStateResponse';
import type { GigaHashrate as _braiins_bos_v1_GigaHashrate, GigaHashrate__Output as _braiins_bos_v1_GigaHashrate__Output } from './braiins/bos/v1/GigaHashrate';
import type { Hours as _braiins_bos_v1_Hours, Hours__Output as _braiins_bos_v1_Hours__Output } from './braiins/bos/v1/Hours';
import type { LicenseServiceClient as _braiins_bos_v1_LicenseServiceClient, LicenseServiceDefinition as _braiins_bos_v1_LicenseServiceDefinition } from './braiins/bos/v1/LicenseService';
import type { LimitedLicense as _braiins_bos_v1_LimitedLicense, LimitedLicense__Output as _braiins_bos_v1_LimitedLicense__Output } from './braiins/bos/v1/LimitedLicense';
import type { MegaHashrate as _braiins_bos_v1_MegaHashrate, MegaHashrate__Output as _braiins_bos_v1_MegaHashrate__Output } from './braiins/bos/v1/MegaHashrate';
import type { NoneLicense as _braiins_bos_v1_NoneLicense, NoneLicense__Output as _braiins_bos_v1_NoneLicense__Output } from './braiins/bos/v1/NoneLicense';
import type { Power as _braiins_bos_v1_Power, Power__Output as _braiins_bos_v1_Power__Output } from './braiins/bos/v1/Power';
import type { PowerEfficiency as _braiins_bos_v1_PowerEfficiency, PowerEfficiency__Output as _braiins_bos_v1_PowerEfficiency__Output } from './braiins/bos/v1/PowerEfficiency';
import type { Temperature as _braiins_bos_v1_Temperature, Temperature__Output as _braiins_bos_v1_Temperature__Output } from './braiins/bos/v1/Temperature';
import type { TeraHashrate as _braiins_bos_v1_TeraHashrate, TeraHashrate__Output as _braiins_bos_v1_TeraHashrate__Output } from './braiins/bos/v1/TeraHashrate';
import type { ValidLicense as _braiins_bos_v1_ValidLicense, ValidLicense__Output as _braiins_bos_v1_ValidLicense__Output } from './braiins/bos/v1/ValidLicense';
import type { Voltage as _braiins_bos_v1_Voltage, Voltage__Output as _braiins_bos_v1_Voltage__Output } from './braiins/bos/v1/Voltage';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  braiins: {
    bos: {
      v1: {
        ApplyContractKeyRequest: MessageTypeDefinition<_braiins_bos_v1_ApplyContractKeyRequest, _braiins_bos_v1_ApplyContractKeyRequest__Output>
        ApplyContractKeyResponse: MessageTypeDefinition<_braiins_bos_v1_ApplyContractKeyResponse, _braiins_bos_v1_ApplyContractKeyResponse__Output>
        BasesPoints: MessageTypeDefinition<_braiins_bos_v1_BasesPoints, _braiins_bos_v1_BasesPoints__Output>
        DayOfWeek: EnumTypeDefinition
        ExpiredLicense: MessageTypeDefinition<_braiins_bos_v1_ExpiredLicense, _braiins_bos_v1_ExpiredLicense__Output>
        Frequency: MessageTypeDefinition<_braiins_bos_v1_Frequency, _braiins_bos_v1_Frequency__Output>
        GetLicenseStateRequest: MessageTypeDefinition<_braiins_bos_v1_GetLicenseStateRequest, _braiins_bos_v1_GetLicenseStateRequest__Output>
        GetLicenseStateResponse: MessageTypeDefinition<_braiins_bos_v1_GetLicenseStateResponse, _braiins_bos_v1_GetLicenseStateResponse__Output>
        GigaHashrate: MessageTypeDefinition<_braiins_bos_v1_GigaHashrate, _braiins_bos_v1_GigaHashrate__Output>
        Hours: MessageTypeDefinition<_braiins_bos_v1_Hours, _braiins_bos_v1_Hours__Output>
        LicenseService: SubtypeConstructor<typeof grpc.Client, _braiins_bos_v1_LicenseServiceClient> & { service: _braiins_bos_v1_LicenseServiceDefinition }
        LicenseType: EnumTypeDefinition
        LimitedLicense: MessageTypeDefinition<_braiins_bos_v1_LimitedLicense, _braiins_bos_v1_LimitedLicense__Output>
        MegaHashrate: MessageTypeDefinition<_braiins_bos_v1_MegaHashrate, _braiins_bos_v1_MegaHashrate__Output>
        NoneLicense: MessageTypeDefinition<_braiins_bos_v1_NoneLicense, _braiins_bos_v1_NoneLicense__Output>
        Power: MessageTypeDefinition<_braiins_bos_v1_Power, _braiins_bos_v1_Power__Output>
        PowerEfficiency: MessageTypeDefinition<_braiins_bos_v1_PowerEfficiency, _braiins_bos_v1_PowerEfficiency__Output>
        Temperature: MessageTypeDefinition<_braiins_bos_v1_Temperature, _braiins_bos_v1_Temperature__Output>
        TeraHashrate: MessageTypeDefinition<_braiins_bos_v1_TeraHashrate, _braiins_bos_v1_TeraHashrate__Output>
        ValidLicense: MessageTypeDefinition<_braiins_bos_v1_ValidLicense, _braiins_bos_v1_ValidLicense__Output>
        Voltage: MessageTypeDefinition<_braiins_bos_v1_Voltage, _braiins_bos_v1_Voltage__Output>
      }
    }
  }
}

