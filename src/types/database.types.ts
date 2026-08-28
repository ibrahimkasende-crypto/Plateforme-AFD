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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      actualites: {
        Row: {
          author: string | null
          category: string | null
          content: string
          created_at: string | null
          excerpt: string
          id: string
          image_url: string | null
          published: boolean | null
          published_at: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          category?: string | null
          content: string
          created_at?: string | null
          excerpt: string
          id?: string
          image_url?: string | null
          published?: boolean | null
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string
          id?: string
          image_url?: string | null
          published?: boolean | null
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      administrateurs: {
        Row: {
          date_creation: string
          email: string
          est_admin: boolean
          id: string
        }
        Insert: {
          date_creation?: string
          email: string
          est_admin?: boolean
          id: string
        }
        Update: {
          date_creation?: string
          email?: string
          est_admin?: boolean
          id?: string
        }
        Relationships: []
      }
      clusters: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          order: number | null
          type: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          order?: number | null
          type?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          order?: number | null
          type?: string | null
        }
        Relationships: []
      }
      dons: {
        Row: {
          amount: number
          bank_name: string | null
          beneficiary_account: string | null
          created_at: string | null
          currency: string | null
          donor_country: string | null
          donor_email: string
          donor_name: string
          donor_phone: string | null
          id: string
          is_anonymous: boolean
          message: string | null
          payment_method: string
          reference: string | null
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          status: string | null
          support_type: string | null
          updated_at: string | null
          user_id: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          amount: number
          bank_name?: string | null
          beneficiary_account?: string | null
          created_at?: string | null
          currency?: string | null
          donor_country?: string | null
          donor_email: string
          donor_name: string
          donor_phone?: string | null
          id?: string
          is_anonymous?: boolean
          message?: string | null
          payment_method: string
          reference?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          status?: string | null
          support_type?: string | null
          updated_at?: string | null
          user_id?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          amount?: number
          bank_name?: string | null
          beneficiary_account?: string | null
          created_at?: string | null
          currency?: string | null
          donor_country?: string | null
          donor_email?: string
          donor_name?: string
          donor_phone?: string | null
          id?: string
          is_anonymous?: boolean
          message?: string | null
          payment_method?: string
          reference?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          status?: string | null
          support_type?: string | null
          updated_at?: string | null
          user_id?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      dons_coordonnees_bancaires: {
        Row: {
          account_cdf: string
          account_holder: string
          account_usd: string
          bank_name: string
          cdf_enabled: boolean
          correspondent_eur_address: string | null
          correspondent_eur_bank: string | null
          correspondent_eur_swift: string | null
          correspondent_usd_address: string | null
          correspondent_usd_bank: string | null
          correspondent_usd_swift: string | null
          created_at: string
          eur_note: string | null
          id: string
          instructions: string | null
          is_active: boolean
          swift: string
          updated_at: string
          updated_by: string | null
          usd_enabled: boolean
        }
        Insert: {
          account_cdf?: string
          account_holder?: string
          account_usd?: string
          bank_name?: string
          cdf_enabled?: boolean
          correspondent_eur_address?: string | null
          correspondent_eur_bank?: string | null
          correspondent_eur_swift?: string | null
          correspondent_usd_address?: string | null
          correspondent_usd_bank?: string | null
          correspondent_usd_swift?: string | null
          created_at?: string
          eur_note?: string | null
          id?: string
          instructions?: string | null
          is_active?: boolean
          swift?: string
          updated_at?: string
          updated_by?: string | null
          usd_enabled?: boolean
        }
        Update: {
          account_cdf?: string
          account_holder?: string
          account_usd?: string
          bank_name?: string
          cdf_enabled?: boolean
          correspondent_eur_address?: string | null
          correspondent_eur_bank?: string | null
          correspondent_eur_swift?: string | null
          correspondent_usd_address?: string | null
          correspondent_usd_bank?: string | null
          correspondent_usd_swift?: string | null
          created_at?: string
          eur_note?: string | null
          id?: string
          instructions?: string | null
          is_active?: boolean
          swift?: string
          updated_at?: string
          updated_by?: string | null
          usd_enabled?: boolean
        }
        Relationships: []
      }
      dons_preuves: {
        Row: {
          created_at: string
          don_id: string
          id: string
          mime_type: string | null
          original_filename: string | null
          storage_path: string
          uploaded_at: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          don_id: string
          id?: string
          mime_type?: string | null
          original_filename?: string | null
          storage_path: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          don_id?: string
          id?: string
          mime_type?: string | null
          original_filename?: string | null
          storage_path?: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dons_preuves_don_id_fkey"
            columns: ["don_id"]
            isOneToOne: false
            referencedRelation: "dons"
            referencedColumns: ["id"]
          },
        ]
      }
      dons_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          don_id: string
          from_status: string | null
          id: string
          note: string | null
          to_status: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          don_id: string
          from_status?: string | null
          id?: string
          note?: string | null
          to_status: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          don_id?: string
          from_status?: string | null
          id?: string
          note?: string | null
          to_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "dons_status_history_don_id_fkey"
            columns: ["don_id"]
            isOneToOne: false
            referencedRelation: "dons"
            referencedColumns: ["id"]
          },
        ]
      }
      galerie: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          id: string
          media_type: string | null
          media_url: string
          program_id: string | null
          project_id: string | null
          thumbnail_url: string | null
          title: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          media_type?: string | null
          media_url: string
          program_id?: string | null
          project_id?: string | null
          thumbnail_url?: string | null
          title: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          media_type?: string | null
          media_url?: string
          program_id?: string | null
          project_id?: string | null
          thumbnail_url?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programmes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projets"
            referencedColumns: ["id"]
          },
        ]
      }
      galerie_backup_url_20260704: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          id: string | null
          media_type: string | null
          media_url: string | null
          program_id: string | null
          project_id: string | null
          thumbnail_url: string | null
          title: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          media_type?: string | null
          media_url?: string | null
          program_id?: string | null
          project_id?: string | null
          thumbnail_url?: string | null
          title?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          media_type?: string | null
          media_url?: string | null
          program_id?: string | null
          project_id?: string | null
          thumbnail_url?: string | null
          title?: string | null
        }
        Relationships: []
      }
      membres: {
        Row: {
          address: string
          created_at: string | null
          email: string
          full_name: string
          gender: string
          id: string
          member_type: string | null
          motivation: string
          phone: string
          status: string | null
        }
        Insert: {
          address: string
          created_at?: string | null
          email: string
          full_name: string
          gender: string
          id?: string
          member_type?: string | null
          motivation: string
          phone: string
          status?: string | null
        }
        Update: {
          address?: string
          created_at?: string | null
          email?: string
          full_name?: string
          gender?: string
          id?: string
          member_type?: string | null
          motivation?: string
          phone?: string
          status?: string | null
        }
        Relationships: []
      }
      membres_equipe: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string
          gender: string | null
          id: string
          name: string
          order: number | null
          photo_url: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description: string
          gender?: string | null
          id?: string
          name: string
          order?: number | null
          photo_url?: string | null
          role: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string
          gender?: string | null
          id?: string
          name?: string
          order?: number | null
          photo_url?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string | null
          subject: string
          organisation: string | null
          request_type: string | null
          province: string | null
          email_notification_status: string | null
          email_notification_sent_at: string | null
          email_notification_error: string | null
          notification_recipient: string | null
          notification_attempts: number | null
          auto_reply_status: string | null
          auto_reply_sent_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string | null
          subject: string
          organisation?: string | null
          request_type?: string | null
          province?: string | null
          email_notification_status?: string | null
          email_notification_sent_at?: string | null
          email_notification_error?: string | null
          notification_recipient?: string | null
          notification_attempts?: number | null
          auto_reply_status?: string | null
          auto_reply_sent_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string | null
          subject?: string
          organisation?: string | null
          request_type?: string | null
          province?: string | null
          email_notification_status?: string | null
          email_notification_sent_at?: string | null
          email_notification_error?: string | null
          notification_recipient?: string | null
          notification_attempts?: number | null
          auto_reply_status?: string | null
          auto_reply_sent_at?: string | null
        }
        Relationships: []
      }
      parametres_site: {
        Row: {
          created_at: string | null
          id: string
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      medias: {
        Row: {
          id: string
          bucket: string
          storage_path: string
          filename: string
          original_filename: string | null
          mime_type: string | null
          size_bytes: number | null
          width: number | null
          height: number | null
          alt_text: string | null
          caption: string | null
          credit: string | null
          consent_status: string
          visibility: string
          content_hash: string | null
          resource_type: string | null
          resource_id: string | null
          source_url: string | null
          created_by: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          bucket: string
          storage_path: string
          filename: string
          original_filename?: string | null
          mime_type?: string | null
          size_bytes?: number | null
          width?: number | null
          height?: number | null
          alt_text?: string | null
          caption?: string | null
          credit?: string | null
          consent_status?: string
          visibility?: string
          content_hash?: string | null
          resource_type?: string | null
          resource_id?: string | null
          source_url?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          bucket?: string
          storage_path?: string
          filename?: string
          original_filename?: string | null
          mime_type?: string | null
          size_bytes?: number | null
          width?: number | null
          height?: number | null
          alt_text?: string | null
          caption?: string | null
          credit?: string | null
          consent_status?: string
          visibility?: string
          content_hash?: string | null
          resource_type?: string | null
          resource_id?: string | null
          source_url?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Relationships: []
      }
      partenaires: {
        Row: {
          active: boolean | null
          acronyme: string | null
          category: string | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          logo_media_id: string | null
          logo_url: string | null
          mise_en_avant: boolean | null
          name: string
          order: number | null
          publie: boolean | null
          slug: string | null
          source_imported_at: string | null
          source_url: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          active?: boolean | null
          acronyme?: string | null
          category?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          logo_media_id?: string | null
          logo_url?: string | null
          mise_en_avant?: boolean | null
          name: string
          order?: number | null
          publie?: boolean | null
          slug?: string | null
          source_imported_at?: string | null
          source_url?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          active?: boolean | null
          acronyme?: string | null
          category?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          logo_media_id?: string | null
          logo_url?: string | null
          mise_en_avant?: boolean | null
          name?: string
          order?: number | null
          publie?: boolean | null
          slug?: string | null
          source_imported_at?: string | null
          source_url?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      programmes: {
        Row: {
          active: boolean | null
          color: string | null
          created_at: string | null
          description: string
          icon: string | null
          id: string
          image_url: string | null
          long_description: string
          order: number | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          color?: string | null
          created_at?: string | null
          description: string
          icon?: string | null
          id?: string
          image_url?: string | null
          long_description: string
          order?: number | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          color?: string | null
          created_at?: string | null
          description?: string
          icon?: string | null
          id?: string
          image_url?: string | null
          long_description?: string
          order?: number | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      programmes_backup_20260628: {
        Row: {
          active: boolean | null
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string | null
          long_description: string | null
          order: number | null
          slug: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string | null
          long_description?: string | null
          order?: number | null
          slug?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string | null
          long_description?: string | null
          order?: number | null
          slug?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      programmes_backup_desc_20260629: {
        Row: {
          active: boolean | null
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string | null
          long_description: string | null
          order: number | null
          slug: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string | null
          long_description?: string | null
          order?: number | null
          slug?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string | null
          long_description?: string | null
          order?: number | null
          slug?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      programmes_backup_titres_20260629: {
        Row: {
          active: boolean | null
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string | null
          long_description: string | null
          order: number | null
          slug: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string | null
          long_description?: string | null
          order?: number | null
          slug?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string | null
          long_description?: string | null
          order?: number | null
          slug?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      projets: {
        Row: {
          active: boolean | null
          beneficiaries: number | null
          budget: number | null
          created_at: string | null
          description: string
          end_date: string | null
          id: string
          image_url: string | null
          location: string
          program_id: string | null
          results: string | null
          slug: string
          start_date: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          beneficiaries?: number | null
          budget?: number | null
          created_at?: string | null
          description: string
          end_date?: string | null
          id?: string
          image_url?: string | null
          location: string
          program_id?: string | null
          results?: string | null
          slug: string
          start_date: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          beneficiaries?: number | null
          budget?: number | null
          created_at?: string | null
          description?: string
          end_date?: string | null
          id?: string
          image_url?: string | null
          location?: string
          program_id?: string | null
          results?: string | null
          slug?: string
          start_date?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programmes"
            referencedColumns: ["id"]
          },
        ]
      }
      projets_backup_20260628: {
        Row: {
          active: boolean | null
          beneficiaries: number | null
          budget: number | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string | null
          image_url: string | null
          location: string | null
          program_id: string | null
          results: string | null
          slug: string | null
          start_date: string | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          beneficiaries?: number | null
          budget?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string | null
          image_url?: string | null
          location?: string | null
          program_id?: string | null
          results?: string | null
          slug?: string | null
          start_date?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          beneficiaries?: number | null
          budget?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string | null
          image_url?: string | null
          location?: string | null
          program_id?: string | null
          results?: string | null
          slug?: string | null
          start_date?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      projets_backup_desc_20260629: {
        Row: {
          active: boolean | null
          beneficiaries: number | null
          budget: number | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string | null
          image_url: string | null
          location: string | null
          program_id: string | null
          results: string | null
          slug: string | null
          start_date: string | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          beneficiaries?: number | null
          budget?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string | null
          image_url?: string | null
          location?: string | null
          program_id?: string | null
          results?: string | null
          slug?: string | null
          start_date?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          beneficiaries?: number | null
          budget?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string | null
          image_url?: string | null
          location?: string | null
          program_id?: string | null
          results?: string | null
          slug?: string | null
          start_date?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      opportunites: {
        Row: import("@/features/opportunites/types").Opportunity
        Insert: Partial<import("@/features/opportunites/types").Opportunity>
        Update: Partial<import("@/features/opportunites/types").Opportunity>
        Relationships: []
      }
      candidatures: {
        Row: { id: string; opportunite_id: string | null; est_spontanee: boolean; prenom: string; nom: string; email: string; telephone: string | null; localisation: string | null; pays: string | null; ville: string | null; niveau_etudes: string | null; experience: string | null; domaine_souhaite: string | null; lettre_motivation: string; cv_storage_path: string | null; lettre_storage_path: string | null; note_interne: string | null; statut: string; consentement: boolean; metadata: Json; created_at: string; updated_at: string; deleted_at: string | null }
        Insert: { id?: string; opportunite_id?: string | null; est_spontanee?: boolean; prenom: string; nom: string; email: string; telephone?: string | null; localisation?: string | null; pays?: string | null; ville?: string | null; niveau_etudes?: string | null; experience?: string | null; domaine_souhaite?: string | null; lettre_motivation: string; cv_storage_path?: string | null; lettre_storage_path?: string | null; note_interne?: string | null; statut?: string; consentement: boolean; metadata?: Json; created_at?: string; updated_at?: string; deleted_at?: string | null }
        Update: Partial<Database["public"]["Tables"]["candidatures"]["Insert"]>
        Relationships: []
      }
      documents: {
        Row: import("@/features/documents/types").DocumentCentre
        Insert: Partial<import("@/features/documents/types").DocumentCentre>
        Update: Partial<import("@/features/documents/types").DocumentCentre>
        Relationships: []
      }
      documents_candidature: {
        Row: { id: string; candidature_id: string; nom_fichier: string; chemin_storage: string; type_mime: string | null; taille_octets: number | null; created_at: string }
        Insert: { id?: string; candidature_id: string; nom_fichier: string; chemin_storage: string; type_mime?: string | null; taille_octets?: number | null; created_at?: string }
        Update: Partial<Database["public"]["Tables"]["documents_candidature"]["Insert"]>
        Relationships: []
      }
      telechargements_documents: {
        Row: { id: string; document_id: string; telecharge_at: string; metadata: Json }
        Insert: { id?: string; document_id: string; telecharge_at?: string; metadata?: Json }
        Update: Partial<Database["public"]["Tables"]["telechargements_documents"]["Insert"]>
        Relationships: []
      }
      categories_documents: {
        Row: { id: string; nom: string; slug: string; description: string | null; created_at: string }
        Insert: { id?: string; nom: string; slug: string; description?: string | null; created_at?: string }
        Update: Partial<Database["public"]["Tables"]["categories_documents"]["Insert"]>
        Relationships: []
      }
      histoires_impact: {
        Row: import("@/features/impact/types").HistoireImpact
        Insert: Partial<import("@/features/impact/types").HistoireImpact>
        Update: Partial<import("@/features/impact/types").HistoireImpact>
        Relationships: []
      }
      temoignages: {
        Row: import("@/features/impact/types").Temoignage
        Insert: Partial<import("@/features/impact/types").Temoignage>
        Update: Partial<import("@/features/impact/types").Temoignage>
        Relationships: []
      }
      appels_offres: {
        Row: import("@/features/appels-offres/types").AppelOffre
        Insert: Partial<import("@/features/appels-offres/types").AppelOffre>
        Update: Partial<import("@/features/appels-offres/types").AppelOffre>
        Relationships: []
      }
      appels_offres_documents: {
        Row: import("@/features/appels-offres/types").AppelOffreDocument
        Insert: Partial<import("@/features/appels-offres/types").AppelOffreDocument>
        Update: Partial<import("@/features/appels-offres/types").AppelOffreDocument>
        Relationships: []
      }
      pages: {
        Row: {
          id: string
          route: string
          titre: string
          slug: string | null
          surtitre: string | null
          resume: string | null
          description_seo: string | null
          image_og_media_id: string | null
          statut: string
          publie: boolean
          published_at: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          route: string
          titre: string
          slug?: string | null
          surtitre?: string | null
          resume?: string | null
          description_seo?: string | null
          image_og_media_id?: string | null
          statut?: string
          publie?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: Partial<Database["public"]["Tables"]["pages"]["Insert"]>
        Relationships: []
      }
      sections_pages: {
        Row: {
          id: string
          page_id: string
          type_section: string
          titre: string | null
          sous_titre: string | null
          contenu: string | null
          media_id: string | null
          ordre: number
          active: boolean
          configuration: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          page_id: string
          type_section?: string
          titre?: string | null
          sous_titre?: string | null
          contenu?: string | null
          media_id?: string | null
          ordre?: number
          active?: boolean
          configuration?: Json
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["sections_pages"]["Insert"]>
        Relationships: []
      }
      agents_terrain: {
        Row: {
          id: string
          user_id: string | null
          matricule: string | null
          full_name: string
          fonction: string | null
          telephone: string | null
          province: string | null
          territoire: string | null
          programme_id: string | null
          projet_id: string | null
          superviseur_id: string | null
          actif: boolean
          disponibilite: string | null
          date_affectation: string | null
          notes_internes: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          matricule?: string | null
          full_name: string
          fonction?: string | null
          telephone?: string | null
          province?: string | null
          territoire?: string | null
          programme_id?: string | null
          projet_id?: string | null
          superviseur_id?: string | null
          actif?: boolean
          disponibilite?: string | null
          date_affectation?: string | null
          notes_internes?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: Partial<Database["public"]["Tables"]["agents_terrain"]["Insert"]>
        Relationships: []
      }
      enquetes: {
        Row: import("@/features/enquetes/types").Enquete
        Insert: Partial<import("@/features/enquetes/types").Enquete>
        Update: Partial<import("@/features/enquetes/types").Enquete>
        Relationships: []
      }
      questions_enquete: {
        Row: import("@/features/enquetes/types").QuestionEnquete
        Insert: Partial<import("@/features/enquetes/types").QuestionEnquete>
        Update: Partial<import("@/features/enquetes/types").QuestionEnquete>
        Relationships: []
      }
      options_questions: {
        Row: import("@/features/enquetes/types").OptionQuestion
        Insert: Partial<import("@/features/enquetes/types").OptionQuestion>
        Update: Partial<import("@/features/enquetes/types").OptionQuestion>
        Relationships: []
      }
      reponses_enquete: {
        Row: {
          id: string
          enquete_id: string
          agent_id: string | null
          projet_id: string | null
          province: string | null
          repondant_anonyme: boolean
          statut: string
          consentement: boolean
          localisation: Json | null
          submitted_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          enquete_id: string
          agent_id?: string | null
          projet_id?: string | null
          province?: string | null
          repondant_anonyme?: boolean
          statut?: string
          consentement?: boolean
          localisation?: Json | null
          submitted_at?: string | null
          created_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["reponses_enquete"]["Insert"]>
        Relationships: []
      }
      reponses_questions: {
        Row: {
          id: string
          reponse_enquete_id: string
          question_id: string
          valeur_texte: string | null
          valeur_nombre: number | null
          valeur_json: Json | null
          fichier_path: string | null
          created_at: string
        }
        Insert: {
          id?: string
          reponse_enquete_id: string
          question_id: string
          valeur_texte?: string | null
          valeur_nombre?: number | null
          valeur_json?: Json | null
          fichier_path?: string | null
          created_at?: string
        }
        Update: Partial<Database["public"]["Tables"]["reponses_questions"]["Insert"]>
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      next_don_reference: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
