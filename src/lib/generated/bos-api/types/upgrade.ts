import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { AutoUpgradeSchedule as _braiins_bos_v1_AutoUpgradeSchedule, AutoUpgradeSchedule__Output as _braiins_bos_v1_AutoUpgradeSchedule__Output } from './braiins/bos/v1/AutoUpgradeSchedule';
import type { BasesPoints as _braiins_bos_v1_BasesPoints, BasesPoints__Output as _braiins_bos_v1_BasesPoints__Output } from './braiins/bos/v1/BasesPoints';
import type { DailySchedule as _braiins_bos_v1_DailySchedule, DailySchedule__Output as _braiins_bos_v1_DailySchedule__Output } from './braiins/bos/v1/DailySchedule';
import type { Frequency as _braiins_bos_v1_Frequency, Frequency__Output as _braiins_bos_v1_Frequency__Output } from './braiins/bos/v1/Frequency';
import type { GetAutoUpgradeStatusRequest as _braiins_bos_v1_GetAutoUpgradeStatusRequest, GetAutoUpgradeStatusRequest__Output as _braiins_bos_v1_GetAutoUpgradeStatusRequest__Output } from './braiins/bos/v1/GetAutoUpgradeStatusRequest';
import type { GetAutoUpgradeStatusResponse as _braiins_bos_v1_GetAutoUpgradeStatusResponse, GetAutoUpgradeStatusResponse__Output as _braiins_bos_v1_GetAutoUpgradeStatusResponse__Output } from './braiins/bos/v1/GetAutoUpgradeStatusResponse';
import type { GigaHashrate as _braiins_bos_v1_GigaHashrate, GigaHashrate__Output as _braiins_bos_v1_GigaHashrate__Output } from './braiins/bos/v1/GigaHashrate';
import type { Hours as _braiins_bos_v1_Hours, Hours__Output as _braiins_bos_v1_Hours__Output } from './braiins/bos/v1/Hours';
import type { MegaHashrate as _braiins_bos_v1_MegaHashrate, MegaHashrate__Output as _braiins_bos_v1_MegaHashrate__Output } from './braiins/bos/v1/MegaHashrate';
import type { MonthlySchedule as _braiins_bos_v1_MonthlySchedule, MonthlySchedule__Output as _braiins_bos_v1_MonthlySchedule__Output } from './braiins/bos/v1/MonthlySchedule';
import type { Power as _braiins_bos_v1_Power, Power__Output as _braiins_bos_v1_Power__Output } from './braiins/bos/v1/Power';
import type { PowerEfficiency as _braiins_bos_v1_PowerEfficiency, PowerEfficiency__Output as _braiins_bos_v1_PowerEfficiency__Output } from './braiins/bos/v1/PowerEfficiency';
import type { RestoreStockRequest as _braiins_bos_v1_RestoreStockRequest, RestoreStockRequest__Output as _braiins_bos_v1_RestoreStockRequest__Output } from './braiins/bos/v1/RestoreStockRequest';
import type { RestoreStockResponse as _braiins_bos_v1_RestoreStockResponse, RestoreStockResponse__Output as _braiins_bos_v1_RestoreStockResponse__Output } from './braiins/bos/v1/RestoreStockResponse';
import type { SystemUpgradeMetadata as _braiins_bos_v1_SystemUpgradeMetadata, SystemUpgradeMetadata__Output as _braiins_bos_v1_SystemUpgradeMetadata__Output } from './braiins/bos/v1/SystemUpgradeMetadata';
import type { SystemUpgradeRequest as _braiins_bos_v1_SystemUpgradeRequest, SystemUpgradeRequest__Output as _braiins_bos_v1_SystemUpgradeRequest__Output } from './braiins/bos/v1/SystemUpgradeRequest';
import type { SystemUpgradeResponse as _braiins_bos_v1_SystemUpgradeResponse, SystemUpgradeResponse__Output as _braiins_bos_v1_SystemUpgradeResponse__Output } from './braiins/bos/v1/SystemUpgradeResponse';
import type { Temperature as _braiins_bos_v1_Temperature, Temperature__Output as _braiins_bos_v1_Temperature__Output } from './braiins/bos/v1/Temperature';
import type { TeraHashrate as _braiins_bos_v1_TeraHashrate, TeraHashrate__Output as _braiins_bos_v1_TeraHashrate__Output } from './braiins/bos/v1/TeraHashrate';
import type { UpdateAutoUpgradeConfigRequest as _braiins_bos_v1_UpdateAutoUpgradeConfigRequest, UpdateAutoUpgradeConfigRequest__Output as _braiins_bos_v1_UpdateAutoUpgradeConfigRequest__Output } from './braiins/bos/v1/UpdateAutoUpgradeConfigRequest';
import type { UpdateAutoUpgradeConfigResponse as _braiins_bos_v1_UpdateAutoUpgradeConfigResponse, UpdateAutoUpgradeConfigResponse__Output as _braiins_bos_v1_UpdateAutoUpgradeConfigResponse__Output } from './braiins/bos/v1/UpdateAutoUpgradeConfigResponse';
import type { UpgradeServiceClient as _braiins_bos_v1_UpgradeServiceClient, UpgradeServiceDefinition as _braiins_bos_v1_UpgradeServiceDefinition } from './braiins/bos/v1/UpgradeService';
import type { UpgradeTime as _braiins_bos_v1_UpgradeTime, UpgradeTime__Output as _braiins_bos_v1_UpgradeTime__Output } from './braiins/bos/v1/UpgradeTime';
import type { Voltage as _braiins_bos_v1_Voltage, Voltage__Output as _braiins_bos_v1_Voltage__Output } from './braiins/bos/v1/Voltage';
import type { WeeklySchedule as _braiins_bos_v1_WeeklySchedule, WeeklySchedule__Output as _braiins_bos_v1_WeeklySchedule__Output } from './braiins/bos/v1/WeeklySchedule';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from './google/protobuf/Timestamp';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  braiins: {
    bos: {
      v1: {
        AutoUpgradeSchedule: MessageTypeDefinition<_braiins_bos_v1_AutoUpgradeSchedule, _braiins_bos_v1_AutoUpgradeSchedule__Output>
        BasesPoints: MessageTypeDefinition<_braiins_bos_v1_BasesPoints, _braiins_bos_v1_BasesPoints__Output>
        DailySchedule: MessageTypeDefinition<_braiins_bos_v1_DailySchedule, _braiins_bos_v1_DailySchedule__Output>
        DayOfWeek: EnumTypeDefinition
        Frequency: MessageTypeDefinition<_braiins_bos_v1_Frequency, _braiins_bos_v1_Frequency__Output>
        GetAutoUpgradeStatusRequest: MessageTypeDefinition<_braiins_bos_v1_GetAutoUpgradeStatusRequest, _braiins_bos_v1_GetAutoUpgradeStatusRequest__Output>
        GetAutoUpgradeStatusResponse: MessageTypeDefinition<_braiins_bos_v1_GetAutoUpgradeStatusResponse, _braiins_bos_v1_GetAutoUpgradeStatusResponse__Output>
        GigaHashrate: MessageTypeDefinition<_braiins_bos_v1_GigaHashrate, _braiins_bos_v1_GigaHashrate__Output>
        Hours: MessageTypeDefinition<_braiins_bos_v1_Hours, _braiins_bos_v1_Hours__Output>
        MegaHashrate: MessageTypeDefinition<_braiins_bos_v1_MegaHashrate, _braiins_bos_v1_MegaHashrate__Output>
        MonthlySchedule: MessageTypeDefinition<_braiins_bos_v1_MonthlySchedule, _braiins_bos_v1_MonthlySchedule__Output>
        Power: MessageTypeDefinition<_braiins_bos_v1_Power, _braiins_bos_v1_Power__Output>
        PowerEfficiency: MessageTypeDefinition<_braiins_bos_v1_PowerEfficiency, _braiins_bos_v1_PowerEfficiency__Output>
        RestoreStockRequest: MessageTypeDefinition<_braiins_bos_v1_RestoreStockRequest, _braiins_bos_v1_RestoreStockRequest__Output>
        RestoreStockResponse: MessageTypeDefinition<_braiins_bos_v1_RestoreStockResponse, _braiins_bos_v1_RestoreStockResponse__Output>
        SystemUpgradeMetadata: MessageTypeDefinition<_braiins_bos_v1_SystemUpgradeMetadata, _braiins_bos_v1_SystemUpgradeMetadata__Output>
        SystemUpgradeRequest: MessageTypeDefinition<_braiins_bos_v1_SystemUpgradeRequest, _braiins_bos_v1_SystemUpgradeRequest__Output>
        SystemUpgradeResponse: MessageTypeDefinition<_braiins_bos_v1_SystemUpgradeResponse, _braiins_bos_v1_SystemUpgradeResponse__Output>
        Temperature: MessageTypeDefinition<_braiins_bos_v1_Temperature, _braiins_bos_v1_Temperature__Output>
        TeraHashrate: MessageTypeDefinition<_braiins_bos_v1_TeraHashrate, _braiins_bos_v1_TeraHashrate__Output>
        UpdateAutoUpgradeConfigRequest: MessageTypeDefinition<_braiins_bos_v1_UpdateAutoUpgradeConfigRequest, _braiins_bos_v1_UpdateAutoUpgradeConfigRequest__Output>
        UpdateAutoUpgradeConfigResponse: MessageTypeDefinition<_braiins_bos_v1_UpdateAutoUpgradeConfigResponse, _braiins_bos_v1_UpdateAutoUpgradeConfigResponse__Output>
        UpgradeService: SubtypeConstructor<typeof grpc.Client, _braiins_bos_v1_UpgradeServiceClient> & { service: _braiins_bos_v1_UpgradeServiceDefinition }
        UpgradeTime: MessageTypeDefinition<_braiins_bos_v1_UpgradeTime, _braiins_bos_v1_UpgradeTime__Output>
        Voltage: MessageTypeDefinition<_braiins_bos_v1_Voltage, _braiins_bos_v1_Voltage__Output>
        WeeklySchedule: MessageTypeDefinition<_braiins_bos_v1_WeeklySchedule, _braiins_bos_v1_WeeklySchedule__Output>
      }
    }
  }
  google: {
    protobuf: {
      Timestamp: MessageTypeDefinition<_google_protobuf_Timestamp, _google_protobuf_Timestamp__Output>
    }
  }
}

