import { supabase } from "./supabase"
import type { Database } from "./supabase"

type Account = Database["public"]["Tables"]["accounts"]["Row"]
type Trade = Database["public"]["Tables"]["trades"]["Row"]
type AccountInsert = Database["public"]["Tables"]["accounts"]["Insert"]
type TradeInsert = Database["public"]["Tables"]["trades"]["Insert"]

export class StorageService {
  private static useSupabase = false

  static setStorageMode(useSupabase: boolean) {
    this.useSupabase = useSupabase
  }

  // Local Storage functions
  static saveToLocal(key: string, data: any) {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(data))
    }
  }

  static getFromLocal(key: string) {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    }
    return null
  }

  static removeFromLocal(key: string) {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key)
    }
  }

  // Account operations
  static async saveAccounts(accounts: Account[]) {
    if (this.useSupabase) {
      try {
        if (accounts.length > 0) {
          const { error: insertError } = await supabase.from("accounts").upsert(
            accounts.map((acc) => ({
              id: acc.id,
              name: acc.name,
              initial_balance: acc.initial_balance,
              current_balance: acc.current_balance,
              currency: acc.currency,
            })),
          )
          if (insertError) throw insertError
        }
        return { success: true }
      } catch (error) {
        console.error("Supabase save accounts error:", error)
        // Fallback to local storage
        this.saveToLocal("trading-accounts", accounts)
        return { success: false, error }
      }
    } else {
      this.saveToLocal("trading-accounts", accounts)
      return { success: true }
    }
  }

  static async getAccounts(): Promise<Account[]> {
    if (this.useSupabase) {
      try {
        const { data, error } = await supabase.from("accounts").select("*").order("created_at", { ascending: false })

        if (error) throw error
        return data || []
      } catch (error) {
        console.error("Supabase get accounts error:", error)
        // Fallback to local storage
        return this.getFromLocal("trading-accounts") || []
      }
    } else {
      return this.getFromLocal("trading-accounts") || []
    }
  }

  static async saveAccount(account: Account) {
    if (this.useSupabase) {
      try {
        const { error } = await supabase.from("accounts").upsert({
          id: account.id,
          name: account.name,
          initial_balance: account.initial_balance,
          current_balance: account.current_balance,
          currency: account.currency,
        })

        if (error) throw error
        return { success: true }
      } catch (error) {
        console.error("Supabase save account error:", error)
        return { success: false, error }
      }
    } else {
      // For local storage, we need to update the accounts array
      const accounts = this.getFromLocal("trading-accounts") || []
      const index = accounts.findIndex((acc: Account) => acc.id === account.id)
      if (index >= 0) {
        accounts[index] = account
      } else {
        accounts.push(account)
      }
      this.saveToLocal("trading-accounts", accounts)
      return { success: true }
    }
  }

  static async deleteAccount(accountId: string) {
    if (this.useSupabase) {
      try {
        // Delete account (trades will be deleted by CASCADE)
        const { error } = await supabase.from("accounts").delete().eq("id", accountId)

        if (error) throw error
        return { success: true }
      } catch (error) {
        console.error("Supabase delete account error:", error)
        return { success: false, error }
      }
    } else {
      // For local storage
      const accounts = this.getFromLocal("trading-accounts") || []
      const trades = this.getFromLocal("trading-journal") || []

      const filteredAccounts = accounts.filter((acc: Account) => acc.id !== accountId)
      const filteredTrades = trades.filter((trade: Trade) => trade.account_id !== accountId)

      this.saveToLocal("trading-accounts", filteredAccounts)
      this.saveToLocal("trading-journal", filteredTrades)
      return { success: true }
    }
  }

  // Trade operations
  static async saveTrades(trades: Trade[]) {
    if (this.useSupabase) {
      try {
        if (trades.length > 0) {
          const { error: insertError } = await supabase.from("trades").upsert(
            trades.map((trade) => ({
              id: trade.id,
              account_id: trade.account_id,
              date: trade.date,
              symbol: trade.symbol,
              type: trade.type,
              lot_size: trade.lot_size,
              entry_price: trade.entry_price,
              exit_price: trade.exit_price,
              stop_loss: trade.stop_loss,
              take_profit: trade.take_profit,
              pnl: trade.pnl,
              status: trade.status,
              emotion: trade.emotion,
              mistakes: trade.mistakes,
              lessons: trade.lessons,
              notes: trade.notes,
              tags: trade.tags,
              risk_amount: trade.risk_amount,
              r_multiple: trade.r_multiple,
              screenshot_url: trade.screenshot_url,
            })),
          )
          if (insertError) throw insertError
        }
        return { success: true }
      } catch (error) {
        console.error("Supabase save trades error:", error)
        // Fallback to local storage
        this.saveToLocal("trading-journal", trades)
        return { success: false, error }
      }
    } else {
      this.saveToLocal("trading-journal", trades)
      return { success: true }
    }
  }

  static async getTrades(): Promise<Trade[]> {
    if (this.useSupabase) {
      try {
        const { data, error } = await supabase.from("trades").select("*").order("date", { ascending: false })

        if (error) throw error
        return data || []
      } catch (error) {
        console.error("Supabase get trades error:", error)
        // Fallback to local storage
        return this.getFromLocal("trading-journal") || []
      }
    } else {
      return this.getFromLocal("trading-journal") || []
    }
  }

  static async saveTrade(trade: Trade) {
    if (this.useSupabase) {
      try {
        const { error } = await supabase.from("trades").upsert({
          id: trade.id,
          account_id: trade.account_id,
          date: trade.date,
          symbol: trade.symbol,
          type: trade.type,
          lot_size: trade.lot_size,
          entry_price: trade.entry_price,
          exit_price: trade.exit_price,
          stop_loss: trade.stop_loss,
          take_profit: trade.take_profit,
          pnl: trade.pnl,
          status: trade.status,
          emotion: trade.emotion,
          mistakes: trade.mistakes,
          lessons: trade.lessons,
          notes: trade.notes,
          tags: trade.tags,
          risk_amount: trade.risk_amount,
          r_multiple: trade.r_multiple,
          screenshot_url: trade.screenshot_url,
        })

        if (error) throw error
        return { success: true }
      } catch (error) {
        console.error("Supabase save trade error:", error)
        return { success: false, error }
      }
    } else {
      // For local storage, we need to update the trades array
      const trades = this.getFromLocal("trading-journal") || []
      const index = trades.findIndex((t: Trade) => t.id === trade.id)
      if (index >= 0) {
        trades[index] = trade
      } else {
        trades.push(trade)
      }
      this.saveToLocal("trading-journal", trades)
      return { success: true }
    }
  }

  static async deleteTrade(tradeId: string) {
    if (this.useSupabase) {
      try {
        const { error } = await supabase.from("trades").delete().eq("id", tradeId)

        if (error) throw error
        return { success: true }
      } catch (error) {
        console.error("Supabase delete trade error:", error)
        return { success: false, error }
      }
    } else {
      // For local storage
      const trades = this.getFromLocal("trading-journal") || []
      const filteredTrades = trades.filter((trade: Trade) => trade.id !== tradeId)
      this.saveToLocal("trading-journal", filteredTrades)
      return { success: true }
    }
  }

  // Sync operations
  static async syncToSupabase() {
    try {
      const localAccounts = this.getFromLocal("trading-accounts") || []
      const localTrades = this.getFromLocal("trading-journal") || []

      // Save accounts
      if (localAccounts.length > 0) {
        const { error: accountsError } = await supabase.from("accounts").upsert(
          localAccounts.map((acc: Account) => ({
            id: acc.id,
            name: acc.name,
            initial_balance: acc.initial_balance,
            current_balance: acc.current_balance,
            currency: acc.currency,
          })),
        )

        if (accountsError) throw accountsError
      }

      // Save trades
      if (localTrades.length > 0) {
        const { error: tradesError } = await supabase.from("trades").upsert(
          localTrades.map((trade: Trade) => ({
            id: trade.id,
            account_id: trade.account_id,
            date: trade.date,
            symbol: trade.symbol,
            type: trade.type,
            lot_size: trade.lot_size,
            entry_price: trade.entry_price,
            exit_price: trade.exit_price,
            stop_loss: trade.stop_loss,
            take_profit: trade.take_profit,
            pnl: trade.pnl,
            status: trade.status,
            emotion: trade.emotion,
            mistakes: trade.mistakes,
            lessons: trade.lessons,
            notes: trade.notes,
            tags: trade.tags,
            risk_amount: trade.risk_amount,
            r_multiple: trade.r_multiple,
            screenshot_url: trade.screenshot_url,
          })),
        )

        if (tradesError) throw tradesError
      }

      return { success: true }
    } catch (error) {
      console.error("Sync to Supabase error:", error)
      return { success: false, error }
    }
  }

  static async syncFromSupabase() {
    try {
      // Get data from Supabase
      const { data: accounts, error: accountsError } = await supabase.from("accounts").select("*")

      const { data: trades, error: tradesError } = await supabase.from("trades").select("*")

      if (accountsError) throw accountsError
      if (tradesError) throw tradesError

      // Save to local storage
      this.saveToLocal("trading-accounts", accounts || [])
      this.saveToLocal("trading-journal", trades || [])

      return { success: true, accounts: accounts || [], trades: trades || [] }
    } catch (error) {
      console.error("Sync from Supabase error:", error)
      return { success: false, error }
    }
  }

  // Migration helper
  static async migrateToSupabase() {
    const result = await this.syncToSupabase()
    if (result.success) {
      this.setStorageMode(true)
      this.saveToLocal("use-supabase", true)
    }
    return result
  }
}
