import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      facilities: {
        Row: {
          id: string
          name: string
          description: string | null
          facility_type: 'sauna' | 'cold_plunge' | 'ice_bath' | 'wellness_centre' | 'spa_hotel' | 'thermal_bath'
          address: string
          city: string
          county: string
          postcode: string
          phone: string | null
          email: string | null
          website: string | null
          latitude: number | null
          longitude: number | null
          opening_hours: any | null
          amenities: string[] | null
          images: string[] | null
          rating: number | null
          review_count: number
          price_range: string | null
          verified: boolean
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          facility_type: 'sauna' | 'cold_plunge' | 'ice_bath' | 'wellness_centre' | 'spa_hotel' | 'thermal_bath'
          address: string
          city: string
          county: string
          postcode: string
          phone?: string | null
          email?: string | null
          website?: string | null
          latitude?: number | null
          longitude?: number | null
          opening_hours?: any | null
          amenities?: string[] | null
          images?: string[] | null
          rating?: number | null
          review_count?: number
          price_range?: string | null
          verified?: boolean
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          facility_type?: 'sauna' | 'cold_plunge' | 'ice_bath' | 'wellness_centre' | 'spa_hotel' | 'thermal_bath'
          address?: string
          city?: string
          county?: string
          postcode?: string
          phone?: string | null
          email?: string | null
          website?: string | null
          latitude?: number | null
          longitude?: number | null
          opening_hours?: any | null
          amenities?: string[] | null
          images?: string[] | null
          rating?: number | null
          review_count?: number
          price_range?: string | null
          verified?: boolean
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          facility_id: string
          user_name: string
          user_email: string | null
          rating: number
          title: string | null
          comment: string
          verified_visit: boolean
          helpful_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          facility_id: string
          user_name: string
          user_email?: string | null
          rating: number
          title?: string | null
          comment: string
          verified_visit?: boolean
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          facility_id?: string
          user_name?: string
          user_email?: string | null
          rating?: number
          title?: string | null
          comment?: string
          verified_visit?: boolean
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      locations: {
        Row: {
          id: string
          name: string
          slug: string
          type: 'city' | 'county' | 'region'
          parent_id: string | null
          latitude: number | null
          longitude: number | null
          facility_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          type: 'city' | 'county' | 'region'
          parent_id?: string | null
          latitude?: number | null
          longitude?: number | null
          facility_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          type?: 'city' | 'county' | 'region'
          parent_id?: string | null
          latitude?: number | null
          longitude?: number | null
          facility_count?: number
          created_at?: string
          updated_at?: string
        }
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
  }
}