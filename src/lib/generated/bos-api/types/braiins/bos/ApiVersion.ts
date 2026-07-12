// Original file: bos/version.proto

import type { Long } from '@grpc/proto-loader';

export interface ApiVersion {
  'major'?: (number | string | Long);
  'minor'?: (number | string | Long);
  'patch'?: (number | string | Long);
  'pre'?: (string);
  'build'?: (string);
}

export interface ApiVersion__Output {
  'major'?: (number);
  'minor'?: (number);
  'patch'?: (number);
  'pre'?: (string);
  'build'?: (string);
}
