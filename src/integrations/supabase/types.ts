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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_value: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_value: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_value?: string
          updated_at?: string
        }
        Relationships: []
      }
      credit_reports: {
        Row: {
          active_accounts: number | null
          active_loans: Json | null
          address: string | null
          admin_notes: string | null
          average_score: number
          bureaus_checked: string[]
          cibil_score: number | null
          closed_accounts: number | null
          closed_loans: Json | null
          created_at: string
          credit_age_years: number | null
          credit_cards: Json | null
          credit_utilization: number | null
          crif_score: number | null
          date_of_birth: string | null
          enquiry_details: Json | null
          equifax_score: number | null
          experian_score: number | null
          full_name: string
          gender: string | null
          hard_enquiries: number | null
          id: string
          improvement_tips: string[] | null
          initiated_by: string
          initiator_email: string | null
          is_high_risk: boolean | null
          last_viewed_at: string | null
          mobile: string
          oldest_account_age_months: number | null
          pan_number: string
          partner_id: string | null
          raw_bureau_data: Json | null
          report_generated_at: string
          report_status: string
          risk_flags: string[] | null
          score_category: string | null
          score_factors: Json | null
          soft_enquiries: number | null
          total_accounts: number | null
          transaction_id: string | null
          updated_at: string
          user_email: string
          user_id: string | null
          view_count: number | null
        }
        Insert: {
          active_accounts?: number | null
          active_loans?: Json | null
          address?: string | null
          admin_notes?: string | null
          average_score?: number
          bureaus_checked?: string[]
          cibil_score?: number | null
          closed_accounts?: number | null
          closed_loans?: Json | null
          created_at?: string
          credit_age_years?: number | null
          credit_cards?: Json | null
          credit_utilization?: number | null
          crif_score?: number | null
          date_of_birth?: string | null
          enquiry_details?: Json | null
          equifax_score?: number | null
          experian_score?: number | null
          full_name: string
          gender?: string | null
          hard_enquiries?: number | null
          id?: string
          improvement_tips?: string[] | null
          initiated_by?: string
          initiator_email?: string | null
          is_high_risk?: boolean | null
          last_viewed_at?: string | null
          mobile: string
          oldest_account_age_months?: number | null
          pan_number: string
          partner_id?: string | null
          raw_bureau_data?: Json | null
          report_generated_at?: string
          report_status?: string
          risk_flags?: string[] | null
          score_category?: string | null
          score_factors?: Json | null
          soft_enquiries?: number | null
          total_accounts?: number | null
          transaction_id?: string | null
          updated_at?: string
          user_email: string
          user_id?: string | null
          view_count?: number | null
        }
        Update: {
          active_accounts?: number | null
          active_loans?: Json | null
          address?: string | null
          admin_notes?: string | null
          average_score?: number
          bureaus_checked?: string[]
          cibil_score?: number | null
          closed_accounts?: number | null
          closed_loans?: Json | null
          created_at?: string
          credit_age_years?: number | null
          credit_cards?: Json | null
          credit_utilization?: number | null
          crif_score?: number | null
          date_of_birth?: string | null
          enquiry_details?: Json | null
          equifax_score?: number | null
          experian_score?: number | null
          full_name?: string
          gender?: string | null
          hard_enquiries?: number | null
          id?: string
          improvement_tips?: string[] | null
          initiated_by?: string
          initiator_email?: string | null
          is_high_risk?: boolean | null
          last_viewed_at?: string | null
          mobile?: string
          oldest_account_age_months?: number | null
          pan_number?: string
          partner_id?: string | null
          raw_bureau_data?: Json | null
          report_generated_at?: string
          report_status?: string
          risk_flags?: string[] | null
          score_category?: string | null
          score_factors?: Json | null
          soft_enquiries?: number | null
          total_accounts?: number | null
          transaction_id?: string | null
          updated_at?: string
          user_email?: string
          user_id?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "credit_reports_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          address: string | null
          commission_rate: number
          created_at: string
          email: string
          franchise_id: string
          id: string
          name: string
          phone: string | null
          status: string
          total_commission_earned: number
          total_commission_paid: number
          total_revenue: number
          total_sales: number
          total_wallet_loaded: number
          updated_at: string
          user_id: string
          wallet_balance: number
        }
        Insert: {
          address?: string | null
          commission_rate?: number
          created_at?: string
          email: string
          franchise_id: string
          id?: string
          name: string
          phone?: string | null
          status?: string
          total_commission_earned?: number
          total_commission_paid?: number
          total_revenue?: number
          total_sales?: number
          total_wallet_loaded?: number
          updated_at?: string
          user_id: string
          wallet_balance?: number
        }
        Update: {
          address?: string | null
          commission_rate?: number
          created_at?: string
          email?: string
          franchise_id?: string
          id?: string
          name?: string
          phone?: string | null
          status?: string
          total_commission_earned?: number
          total_commission_paid?: number
          total_revenue?: number
          total_sales?: number
          total_wallet_loaded?: number
          updated_at?: string
          user_id?: string
          wallet_balance?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          full_name: string
          gender: string | null
          id: string
          pan_number: string | null
          phone: string | null
          referral_code_used: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          full_name: string
          gender?: string | null
          id?: string
          pan_number?: string | null
          phone?: string | null
          referral_code_used?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          full_name?: string
          gender?: string | null
          id?: string
          pan_number?: string | null
          phone?: string | null
          referral_code_used?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      score_repair_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          current_score: number
          id: string
          report_id: string | null
          service_charge: number | null
          status: string
          target_score: number | null
          updated_at: string
          user_email: string
          user_id: string | null
          user_mobile: string
          user_name: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          current_score: number
          id?: string
          report_id?: string | null
          service_charge?: number | null
          status?: string
          target_score?: number | null
          updated_at?: string
          user_email: string
          user_id?: string | null
          user_mobile: string
          user_name: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          current_score?: number
          id?: string
          report_id?: string | null
          service_charge?: number | null
          status?: string
          target_score?: number | null
          updated_at?: string
          user_email?: string
          user_id?: string | null
          user_mobile?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "score_repair_requests_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "credit_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          bureaus_purchased: string[]
          client_mobile: string | null
          client_name: string | null
          client_pan: string | null
          commission_amount: number | null
          created_at: string
          id: string
          initiated_by: string
          initiator_email: string | null
          partner_id: string | null
          payment_gateway: string | null
          payment_method: string | null
          referral_code: string | null
          report_count: number | null
          status: string
          transaction_id: string
          user_email: string
          user_id: string | null
        }
        Insert: {
          amount: number
          bureaus_purchased?: string[]
          client_mobile?: string | null
          client_name?: string | null
          client_pan?: string | null
          commission_amount?: number | null
          created_at?: string
          id?: string
          initiated_by?: string
          initiator_email?: string | null
          partner_id?: string | null
          payment_gateway?: string | null
          payment_method?: string | null
          referral_code?: string | null
          report_count?: number | null
          status?: string
          transaction_id: string
          user_email: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          bureaus_purchased?: string[]
          client_mobile?: string | null
          client_name?: string | null
          client_pan?: string | null
          commission_amount?: number | null
          created_at?: string
          id?: string
          initiated_by?: string
          initiator_email?: string | null
          partner_id?: string | null
          payment_gateway?: string | null
          payment_method?: string | null
          referral_code?: string | null
          report_count?: number | null
          status?: string
          transaction_id?: string
          user_email?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          balance_after: number
          balance_before: number
          created_at: string
          description: string
          id: string
          partner_email: string
          partner_id: string
          reference_id: string | null
          status: string
          transaction_type: string
        }
        Insert: {
          amount: number
          balance_after: number
          balance_before: number
          created_at?: string
          description: string
          id?: string
          partner_email: string
          partner_id: string
          reference_id?: string | null
          status?: string
          transaction_type: string
        }
        Update: {
          amount?: number
          balance_after?: number
          balance_before?: number
          created_at?: string
          description?: string
          id?: string
          partner_email?: string
          partner_id?: string
          reference_id?: string | null
          status?: string
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "user" | "partner_admin" | "master_admin"
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
    Enums: {
      app_role: ["user", "partner_admin", "master_admin"],
    },
  },
} as const
