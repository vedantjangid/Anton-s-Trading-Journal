import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bptnbqgahjhdsvjekuxe.supabase.co"
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdG5icWdhaGpoZHN2amVrdXhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NDE3MTAsImV4cCI6MjA2NzExNzcxMH0.0aJvjwzUhuLexLq7cQmdw4pNlSg-8FzOydF2ZLa2dIM"

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface Database {
  public: {
    Tables: {
      accounts: {
        Row: {
          id: string
          name: string
          initial_balance: number
          current_balance: number
          currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          initial_balance: number
          current_balance: number
          currency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          initial_balance?: number
          current_balance?: number
          currency?: string
          updated_at?: string
        }
      }
      trades: {
        Row: {
          id: string
          account_id: string
          date: string
          symbol: string
          type: "buy" | "sell"
          lot_size: number
          entry_price: number
          exit_price: number | null
          stop_loss: number | null
          take_profit: number | null
          pnl: number | null
          status: "open" | "closed" | "stopped"
          emotion: string | null
          mistakes: string | null
          lessons: string | null
          notes: string | null
          tags: string[]
          risk_amount: number | null
          r_multiple: number | null
          screenshot_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          account_id: string
          date: string
          symbol: string
          type: "buy" | "sell"
          lot_size?: number
          entry_price: number
          exit_price?: number | null
          stop_loss?: number | null
          take_profit?: number | null
          pnl?: number | null
          status?: "open" | "closed" | "stopped"
          emotion?: string | null
          mistakes?: string | null
          lessons?: string | null
          notes?: string | null
          tags?: string[]
          risk_amount?: number | null
          r_multiple?: number | null
          screenshot_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          account_id?: string
          date?: string
          symbol?: string
          type?: "buy" | "sell"
          lot_size?: number
          entry_price?: number
          exit_price?: number | null
          stop_loss?: number | null
          take_profit?: number | null
          pnl?: number | null
          status?: "open" | "closed" | "stopped"
          emotion?: string | null
          mistakes?: string | null
          lessons?: string | null
          notes?: string | null
          tags?: string[]
          risk_amount?: number | null
          r_multiple?: number | null
          screenshot_url?: string | null
          updated_at?: string
        }
      }
    }
  }
}
