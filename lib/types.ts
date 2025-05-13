export interface Shipment {
  id: string;
  tracking_id: string;
  origin_country: string;
  origin_city: string;
  destination_country: string;
  destination_city: string;
  current_location_country: string;
  current_location_city: string;
  current_stage_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ShipmentStage {
  id: string;
  name: string;
  description: string | null;
  order_number: number;
  created_at: string;
}

export interface ShipmentMedia {
  id: string;
  shipment_id: string;
  stage_id: string;
  file_path: string;
  file_type: string;
  created_at: string;
} 