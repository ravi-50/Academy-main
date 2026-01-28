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
      activity_log: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      candidates: {
        Row: {
          candidate_id: string
          cohort_id: string
          created_at: string
          email: string | null
          id: string
          join_date: string
          location: string
          name: string
          skill: string
          status: string
          updated_at: string
        }
        Insert: {
          candidate_id: string
          cohort_id: string
          created_at?: string
          email?: string | null
          id?: string
          join_date?: string
          location: string
          name: string
          skill: string
          status?: string
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          cohort_id?: string
          created_at?: string
          email?: string | null
          id?: string
          join_date?: string
          location?: string
          name?: string
          skill?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidates_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
        ]
      }
      cohorts: {
        Row: {
          bu: string
          candidate_count: number
          coach_id: string | null
          code: string
          created_at: string
          end_date: string | null
          id: string
          location: string
          name: string
          progress: number
          skill: string
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          bu: string
          candidate_count?: number
          coach_id?: string | null
          code: string
          created_at?: string
          end_date?: string | null
          id?: string
          location: string
          name: string
          progress?: number
          skill: string
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          bu?: string
          candidate_count?: number
          coach_id?: string | null
          code?: string
          created_at?: string
          end_date?: string | null
          id?: string
          location?: string
          name?: string
          progress?: number
          skill?: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      daily_efforts: {
        Row: {
          active_genc_count: number | null
          area_of_work: string
          cohort_id: string
          created_at: string
          date: string
          effort_hours: number
          id: string
          mode_of_training: string
          notes: string | null
          session_end_time: string | null
          session_start_time: string | null
          stakeholder_id: string
          stakeholder_name: string
          stakeholder_type: string
          submitted_by: string
          updated_at: string
          virtual_reason: string | null
        }
        Insert: {
          active_genc_count?: number | null
          area_of_work: string
          cohort_id: string
          created_at?: string
          date: string
          effort_hours: number
          id?: string
          mode_of_training: string
          notes?: string | null
          session_end_time?: string | null
          session_start_time?: string | null
          stakeholder_id: string
          stakeholder_name: string
          stakeholder_type: string
          submitted_by: string
          updated_at?: string
          virtual_reason?: string | null
        }
        Update: {
          active_genc_count?: number | null
          area_of_work?: string
          cohort_id?: string
          created_at?: string
          date?: string
          effort_hours?: number
          id?: string
          mode_of_training?: string
          notes?: string | null
          session_end_time?: string | null
          session_start_time?: string | null
          stakeholder_id?: string
          stakeholder_name?: string
          stakeholder_type?: string
          submitted_by?: string
          updated_at?: string
          virtual_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_efforts_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
        ]
      }
      mentors: {
        Row: {
          assignment_end_date: string | null
          assignment_start_date: string | null
          avatar_url: string | null
          cohort_id: string
          created_at: string
          email: string
          emp_id: string
          id: string
          name: string
          phone: string | null
          skill: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          assignment_end_date?: string | null
          assignment_start_date?: string | null
          avatar_url?: string | null
          cohort_id: string
          created_at?: string
          email: string
          emp_id: string
          id?: string
          name: string
          phone?: string | null
          skill: string
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          assignment_end_date?: string | null
          assignment_start_date?: string | null
          avatar_url?: string | null
          cohort_id?: string
          created_at?: string
          email?: string
          emp_id?: string
          id?: string
          name?: string
          phone?: string | null
          skill?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentors_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email: string
          full_name: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trainers: {
        Row: {
          avatar_url: string | null
          cohort_id: string
          created_at: string
          email: string
          emp_id: string
          id: string
          is_internal: boolean
          name: string
          phone: string | null
          skill: string
          status: string
          training_end_date: string | null
          training_start_date: string | null
          type: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          cohort_id: string
          created_at?: string
          email: string
          emp_id: string
          id?: string
          is_internal?: boolean
          name: string
          phone?: string | null
          skill: string
          status?: string
          training_end_date?: string | null
          training_start_date?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          cohort_id?: string
          created_at?: string
          email?: string
          emp_id?: string
          id?: string
          is_internal?: boolean
          name?: string
          phone?: string | null
          skill?: string
          status?: string
          training_end_date?: string | null
          training_start_date?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trainers_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
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
          role: Database["public"]["Enums"]["app_role"]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "coach"
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
      app_role: ["admin", "coach"],
    },
  },
} as const