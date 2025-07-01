export interface ModelMetadata {
  name: string
  model: string
  modified_at: string // ISO 8601 timestamp
  size: number // bytes
  digest: string
  details: ModelDetails
}
interface ModelDetails {
  parent_model: string
  format: string
  family: string
  families: string[]
  parameter_size: string
  quantization_level: string
}
export interface HistoryMessage {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
}
