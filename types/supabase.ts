export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          created_at: string | null
          equipment_id: string | null
          id: string
          message: string
          resolved_at: string | null
          severity: string
        }
        Insert: {
          created_at?: string | null
          equipment_id?: string | null
          id?: string
          message: string
          resolved_at?: string | null
          severity: string
        }
        Update: {
          created_at?: string | null
          equipment_id?: string | null
          id?: string
          message?: string
          resolved_at?: string | null
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment: {
        Row: {
          category: string
          created_at: string | null
          criticality: string | null
          id: string
          installation_date: string | null
          manufacturer: string | null
          name: string
          plant_id: string | null
          power_rating: number | null
          serial_number: string | null
          status: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          criticality?: string | null
          id?: string
          installation_date?: string | null
          manufacturer?: string | null
          name: string
          plant_id?: string | null
          power_rating?: number | null
          serial_number?: string | null
          status?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          criticality?: string | null
          id?: string
          installation_date?: string | null
          manufacturer?: string | null
          name?: string
          plant_id?: string | null
          power_rating?: number | null
          serial_number?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["id"]
          },
        ]
      }
      machine_timelines: {
        Row: {
          end_time: string | null
          equipment_id: string | null
          id: string
          notes: string | null
          start_time: string | null
          state: string
        }
        Insert: {
          end_time?: string | null
          equipment_id?: string | null
          id?: string
          notes?: string | null
          start_time?: string | null
          state: string
        }
        Update: {
          end_time?: string | null
          equipment_id?: string | null
          id?: string
          notes?: string | null
          start_time?: string | null
          state?: string
        }
        Relationships: [
          {
            foreignKeyName: "machine_timelines_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_records: {
        Row: {
          cost: number | null
          description: string | null
          downtime_hours: number | null
          equipment_id: string | null
          id: string
          maintenance_type: string
          performed_at: string | null
          status: string | null
        }
        Insert: {
          cost?: number | null
          description?: string | null
          downtime_hours?: number | null
          equipment_id?: string | null
          id?: string
          maintenance_type: string
          performed_at?: string | null
          status?: string | null
        }
        Update: {
          cost?: number | null
          description?: string | null
          downtime_hours?: number | null
          equipment_id?: string | null
          id?: string
          maintenance_type?: string
          performed_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_records_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      plant_configurations: {
        Row: {
          electricity_cost_per_kwh: number | null
          fuel_cost_per_ton: number | null
          maintenance_budget: number | null
          operating_hours_per_day: number | null
          plant_id: string
          production_capacity_per_hour: number | null
          shutdown_window_days: number | null
          updated_at: string | null
          working_days_per_year: number | null
        }
        Insert: {
          electricity_cost_per_kwh?: number | null
          fuel_cost_per_ton?: number | null
          maintenance_budget?: number | null
          operating_hours_per_day?: number | null
          plant_id: string
          production_capacity_per_hour?: number | null
          shutdown_window_days?: number | null
          updated_at?: string | null
          working_days_per_year?: number | null
        }
        Update: {
          electricity_cost_per_kwh?: number | null
          fuel_cost_per_ton?: number | null
          maintenance_budget?: number | null
          operating_hours_per_day?: number | null
          plant_id?: string
          production_capacity_per_hour?: number | null
          shutdown_window_days?: number | null
          updated_at?: string | null
          working_days_per_year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "plant_configurations_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: true
            referencedRelation: "plants"
            referencedColumns: ["id"]
          },
        ]
      }
      plant_kpis: {
        Row: {
          availability: number | null
          id: string
          oee: number | null
          performance: number | null
          plant_id: string | null
          quality: number | null
          timestamp: string | null
        }
        Insert: {
          availability?: number | null
          id?: string
          oee?: number | null
          performance?: number | null
          plant_id?: string | null
          quality?: number | null
          timestamp?: string | null
        }
        Update: {
          availability?: number | null
          id?: string
          oee?: number | null
          performance?: number | null
          plant_id?: string | null
          quality?: number | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plant_kpis_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["id"]
          },
        ]
      }
      plants: {
        Row: {
          capacity: number | null
          created_at: string | null
          id: string
          location: string | null
          name: string
          status: string | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          id?: string
          location?: string | null
          name: string
          status?: string | null
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          id?: string
          location?: string | null
          name?: string
          status?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          role: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          role?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: string | null
        }
        Relationships: []
      }
      recommendations: {
        Row: {
          created_at: string | null
          description: string | null
          equipment_id: string | null
          estimated_loss: number | null
          id: string
          priority: string | null
          recommended_before: string | null
          repair_cost: number | null
          status: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          equipment_id?: string | null
          estimated_loss?: number | null
          id?: string
          priority?: string | null
          recommended_before?: string | null
          repair_cost?: number | null
          status?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          equipment_id?: string | null
          estimated_loss?: number | null
          id?: string
          priority?: string | null
          recommended_before?: string | null
          repair_cost?: number | null
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string | null
          generated_by: string | null
          id: string
          pdf_url: string | null
          title: string
          type: string | null
        }
        Insert: {
          created_at?: string | null
          generated_by?: string | null
          id?: string
          pdf_url?: string | null
          title: string
          type?: string | null
        }
        Update: {
          created_at?: string | null
          generated_by?: string | null
          id?: string
          pdf_url?: string | null
          title?: string
          type?: string | null
        }
        Relationships: []
      }
      sensors: {
        Row: {
          created_at: string | null
          equipment_id: string | null
          id: string
          maximum: number | null
          minimum: number | null
          sensor_type: string
          unit: string | null
        }
        Insert: {
          created_at?: string | null
          equipment_id?: string | null
          id?: string
          maximum?: number | null
          minimum?: number | null
          sensor_type: string
          unit?: string | null
        }
        Update: {
          created_at?: string | null
          equipment_id?: string | null
          id?: string
          maximum?: number | null
          minimum?: number | null
          sensor_type?: string
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sensors_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      simulation_sessions: {
        Row: {
          created_at: string | null
          delay_days: number
          equipment_id: string | null
          id: string
          predicted_cost: number | null
          predicted_downtime: number | null
          predicted_failure: string | null
        }
        Insert: {
          created_at?: string | null
          delay_days: number
          equipment_id?: string | null
          id?: string
          predicted_cost?: number | null
          predicted_downtime?: number | null
          predicted_failure?: string | null
        }
        Update: {
          created_at?: string | null
          delay_days?: number
          equipment_id?: string | null
          id?: string
          predicted_cost?: number | null
          predicted_downtime?: number | null
          predicted_failure?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "simulation_sessions_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      telemetry: {
        Row: {
          id: string
          sensor_id: string | null
          timestamp: string | null
          value: number
        }
        Insert: {
          id?: string
          sensor_id?: string | null
          timestamp?: string | null
          value: number
        }
        Update: {
          id?: string
          sensor_id?: string | null
          timestamp?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "telemetry_sensor_id_fkey"
            columns: ["sensor_id"]
            isOneToOne: false
            referencedRelation: "sensors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
