export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string | null
          name: string | null
          created_at: string
          updated_at: string
          first_name: string | null
          last_name: string | null
          birthday: string | null
          gender: string | null
          preferred_email: string | null
          is_preferred_email_private: boolean | null
          phone1: string | null
          is_phone1_private: boolean | null
          phone2: string | null
          is_phone2_private: boolean | null
          address: string | null
          city: string | null
          state: string | null
          zip: string | null
          is_address_private: boolean | null
        }
        Insert: {
          id: string
          email?: string | null
          name?: string | null
          created_at?: string
          updated_at?: string
          first_name?: string | null
          last_name?: string | null
          birthday?: string | null
          gender?: string | null
          preferred_email?: string | null
          is_preferred_email_private?: boolean | null
          phone1?: string | null
          is_phone1_private?: boolean | null
          phone2?: string | null
          is_phone2_private?: boolean | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          is_address_private?: boolean | null
        }
        Update: {
          id?: string
          email?: string | null
          name?: string | null
          created_at?: string
          updated_at?: string
          first_name?: string | null
          last_name?: string | null
          birthday?: string | null
          gender?: string | null
          preferred_email?: string | null
          is_preferred_email_private?: boolean | null
          phone1?: string | null
          is_phone1_private?: boolean | null
          phone2?: string | null
          is_phone2_private?: boolean | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
          is_address_private?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      players: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          number: number
          position: string
          height: string | null
          weight: string | null
          birth_date: string | null
          preferred_foot: string | null
          jersey_size: string | null
          years_on_team: number | null
          team_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          number: number
          position: string
          height?: string | null
          weight?: string | null
          birth_date?: string | null
          preferred_foot?: string | null
          jersey_size?: string | null
          years_on_team?: number | null
          team_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          number?: number
          position?: string
          height?: string | null
          weight?: string | null
          birth_date?: string | null
          preferred_foot?: string | null
          jersey_size?: string | null
          years_on_team?: number | null
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "players_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      player_stats: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          player_id: string
          season: string
          games: number
          goals: number
          assists: number
          minutes: number
          yellow_cards: number
          red_cards: number
          clean_sheets: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          player_id: string
          season: string
          games?: number
          goals?: number
          assists?: number
          minutes?: number
          yellow_cards?: number
          red_cards?: number
          clean_sheets?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          player_id?: string
          season?: string
          games?: number
          goals?: number
          assists?: number
          minutes?: number
          yellow_cards?: number
          red_cards?: number
          clean_sheets?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            referencedRelation: "players"
            referencedColumns: ["id"]
          }
        ]
      }
      player_contacts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          player_id: string
          email: string | null
          phone: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          player_id: string
          email?: string | null
          phone?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          player_id?: string
          email?: string | null
          phone?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_contacts_player_id_fkey"
            columns: ["player_id"]
            referencedRelation: "players"
            referencedColumns: ["id"]
          }
        ]
      }
      teams: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          age_group: string
          league: string | null
          season: string
          logo: string | null
          primary_color: string | null
          secondary_color: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          age_group: string
          league?: string | null
          season: string
          logo?: string | null
          primary_color?: string | null
          secondary_color?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          age_group?: string
          league?: string | null
          season?: string
          logo?: string | null
          primary_color?: string | null
          secondary_color?: string | null
        }
        Relationships: []
      }
      staff: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          role: string
          email: string | null
          phone: string | null
          bio: string | null
          avatar: string | null
          team_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          role: string
          email?: string | null
          phone?: string | null
          bio?: string | null
          avatar?: string | null
          team_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          role?: string
          email?: string | null
          phone?: string | null
          bio?: string | null
          avatar?: string | null
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_team_id_fkey"
            columns: ["team_id"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      games: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          team_id: string
          opponent: string
          date: string
          time: string
          location: string
          home_away: string
          type: string
          season: string
          result: string | null
          score_team: number | null
          score_opponent: number | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          team_id: string
          opponent: string
          date: string
          time: string
          location: string
          home_away: string
          type: string
          season: string
          result?: string | null
          score_team?: number | null
          score_opponent?: number | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          team_id?: string
          opponent?: string
          date?: string
          time?: string
          location?: string
          home_away?: string
          type?: string
          season?: string
          result?: string | null
          score_team?: number | null
          score_opponent?: number | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "games_team_id_fkey"
            columns: ["team_id"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      game_attendance: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          game_id: string
          player_id: string
          status: string
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          game_id: string
          player_id: string
          status: string
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          game_id?: string
          player_id?: string
          status?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_attendance_game_id_fkey"
            columns: ["game_id"]
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_attendance_player_id_fkey"
            columns: ["player_id"]
            referencedRelation: "players"
            referencedColumns: ["id"]
          }
        ]
      }
      game_stats: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          game_id: string
          player_id: string
          minutes_played: number
          goals: number
          assists: number
          yellow_cards: number
          red_cards: number
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          game_id: string
          player_id: string
          minutes_played?: number
          goals?: number
          assists?: number
          yellow_cards?: number
          red_cards?: number
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          game_id?: string
          player_id?: string
          minutes_played?: number
          goals?: number
          assists?: number
          yellow_cards?: number
          red_cards?: number
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_stats_game_id_fkey"
            columns: ["game_id"]
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_stats_player_id_fkey"
            columns: ["player_id"]
            referencedRelation: "players"
            referencedColumns: ["id"]
          }
        ]
      }
      announcements: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          content: string
          category: string
          author: string
          team_id: string
          is_pinned: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          content: string
          category: string
          author: string
          team_id: string
          is_pinned?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          content?: string
          category?: string
          author?: string
          team_id?: string
          is_pinned?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "announcements_team_id_fkey"
            columns: ["team_id"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
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