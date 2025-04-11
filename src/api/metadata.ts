import { RtmMetadataItem } from './metadata-Item';
/** @zh-cn
 * 管理元数据。
 */
/**
 * Manages metadata.
 */
export interface RtmMetadataOptions {
  majorRevision: number;
  enableRecordTs?: boolean;
  enableRecordUserId?: boolean;
}

export interface RtmMetadata {
  items: RtmMetadataItem[];
  majorRevision: number;
}
