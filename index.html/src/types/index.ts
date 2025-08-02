export interface SignData {
  id: string;
  photo: string; // base64 encoded image
  sign_details: string;
  sign_type: string;
  mutcd_name: string;
  mutcd_code: string;
  legend_color: string;
  background_color: string;
  sign_shape: string;
  upload_date: string;
  created_at: string;
}

export interface SearchFilters {
  sign_details: string;
  sign_type: string;
  mutcd_name: string;
  mutcd_code: string;
  legend_color: string;
  background_color: string;
  sign_shape: string;
}