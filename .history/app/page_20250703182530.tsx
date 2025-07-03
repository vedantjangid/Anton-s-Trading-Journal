"use client"

import { DialogDescription } from "@/components/ui/dialog"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Download,
  Plus,
  Edit2,
  Trash2,
  Moon,
  Sun,
  Calendar,
  Target,
  Camera,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { StorageService } from "@/lib/storage-service"
import { toast } from "@/hooks/use-toast"

interface Account {
  id: string
  name: string
  initialBalance: number
  currentBalance: number
  currency: string
  createdAt: string
}

interface Trade {
  id: string
  accountId: string
  date: string
  symbol: string
  type: "buy" | "sell"
  lotSize: number
  entryPrice: number
  exitPrice?: number
  stopLoss?: number
  takeProfit?: number
  pnl?: number
  status: "open" | "closed" | "stopped"
  emotion: string
  mistakes: string
  lessons: string
  notes: string
  tags: string[]
  riskAmount?: number
  rMultiple?: number
  screenshot?: string
  screenshotUrl?: string
}

interface Filters {
  account: string
  status: string
  emotion: string
  tag: string
  dateFrom: string
  dateTo: string
  winLoss: string
}

export default function TradingJournal() {
  // All hooks at the top!
  const [loggedIn, setLoggedIn] = useState(false)
  const [loginId, setLoginId] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginError, setLoginError] = useState("")

  const [accounts, setAccounts] = useState<Account[]>([])
  const [trades, setTrades] = useState<Trade[]>([])
  const [currentTrade, setCurrentTrade] = useState<Partial<Trade>>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("accounts")
  const [selectedAccount, setSelectedAccount] = useState<string>("")
  const [darkMode, setDarkMode] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    account: "all",
    status: "all",
    emotion: "all",
    tag: "all",
    dateFrom: "",
    dateTo: "",
    winLoss: "all",
  })
  const [showAddAccount, setShowAddAccount] = useState(false)
  const [newAccount, setNewAccount] = useState({ name: "", initialBalance: 0, currency: "USD" })
  const [currentTag, setCurrentTag] = useState("")

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      const savedDarkMode = StorageService.getFromLocal("dark-mode")

      if (savedDarkMode) setDarkMode(savedDarkMode)

      // Load accounts and trades
      const accounts = await StorageService.getAccounts()
      const trades = await StorageService.getTrades()

      // Map DB fields to UI fields
      const mappedAccounts = accounts.map((acc: any) => ({
        id: acc.id,
        name: acc.name,
        initialBalance: acc.initial_balance ?? acc.initialBalance ?? 0,
        currentBalance: acc.current_balance ?? acc.currentBalance ?? 0,
        currency: acc.currency,
        createdAt: acc.created_at ?? acc.createdAt ?? "",
      }))

      const mappedTrades = trades.map((trade: any) => ({
        id: trade.id,
        accountId: trade.account_id ?? trade.accountId,
        date: trade.date,
        symbol: trade.symbol,
        type: trade.type,
        lotSize: trade.lot_size ?? trade.lotSize ?? 0,
        entryPrice: trade.entry_price ?? trade.entryPrice ?? 0,
        exitPrice: trade.exit_price ?? trade.exitPrice,
        stopLoss: trade.stop_loss ?? trade.stopLoss,
        takeProfit: trade.take_profit ?? trade.takeProfit,
        pnl: trade.pnl,
        status: trade.status,
        emotion: trade.emotion,
        mistakes: trade.mistakes,
        lessons: trade.lessons,
        notes: trade.notes,
        tags: trade.tags,
        riskAmount: trade.risk_amount ?? trade.riskAmount,
        rMultiple: trade.r_multiple ?? trade.rMultiple,
        screenshot: trade.screenshot,
        screenshotUrl: trade.screenshot_url ?? trade.screenshotUrl,
      }))

      setAccounts(mappedAccounts)
      setTrades(mappedTrades)
    }

    loadData()
  }, [])

  // Save accounts when they change
  useEffect(() => {
    if (accounts.length > 0) {
      // Map UI model to DB model
      const dbAccounts = accounts.map((acc) => ({
        id: acc.id,
        name: acc.name,
        initial_balance: acc.initialBalance,
        current_balance: acc.currentBalance,
        currency: acc.currency,
        created_at: acc.createdAt,
        updated_at: new Date().toISOString(),
      }))
      StorageService.saveAccounts(dbAccounts)
    }
  }, [accounts])

  // Save trades when they change
  useEffect(() => {
    if (trades.length > 0) {
      // Map UI model to DB model
      const dbTrades = trades.map((trade) => ({
        id: trade.id,
        account_id: trade.accountId,
        date: trade.date,
        symbol: trade.symbol,
        type: trade.type,
        lot_size: trade.lotSize,
        entry_price: trade.entryPrice,
        exit_price: trade.exitPrice ?? null,
        stop_loss: trade.stopLoss ?? null,
        take_profit: trade.takeProfit ?? null,
        pnl: trade.pnl ?? null,
        status: trade.status,
        emotion: trade.emotion,
        mistakes: trade.mistakes,
        lessons: trade.lessons,
        notes: trade.notes,
        tags: trade.tags,
        risk_amount: trade.riskAmount ?? null,
        r_multiple: trade.rMultiple ?? null,
        screenshot_url: trade.screenshotUrl ?? null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }))
      StorageService.saveTrades(dbTrades)
    }
  }, [trades])

  // Review reminder
  useEffect(() => {
    const lastReview = StorageService.getFromLocal("last-review")
    const now = new Date().getTime()
    const threeDays = 3 * 24 * 60 * 60 * 1000

    if (!lastReview || now - Number.parseInt(lastReview) > threeDays) {
      setTimeout(() => {
        toast({
          title: "📊 Time for Trade Review!",
          description: "Review your last 3 trades to find 1 improvement opportunity.",
        })
        StorageService.saveToLocal("last-review", now.toString())
      }, 5000)
    }
  }, [])

  const handleAddAccount = () => {
    if (!newAccount.name || newAccount.initialBalance <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all account details",
        variant: "destructive",
      })
      return
    }

    const account: Account = {
      id: Date.now().toString(),
      name: newAccount.name,
      initialBalance: newAccount.initialBalance,
      currentBalance: newAccount.initialBalance,
      currency: newAccount.currency,
      createdAt: new Date().toISOString(),
    }

    setAccounts([...accounts, account])
    setNewAccount({ name: "", initialBalance: 0, currency: "USD" })
    setShowAddAccount(false)
    toast({
      title: "Account Created",
      description: `${account.name} account created successfully!`,
    })
  }

  const handleDeleteAccount = async (accountId: string) => {
    if (confirm("Are you sure? This will delete all trades for this account.")) {
      const result = await StorageService.deleteAccount(accountId)

      if (result.success) {
        // Refresh data
        const updatedAccountsRaw = await StorageService.getAccounts()
        const updatedTradesRaw = await StorageService.getTrades()
        // Map DB fields to UI fields
        const updatedAccounts = updatedAccountsRaw.map((acc: any) => ({
          id: acc.id,
          name: acc.name,
          initialBalance: acc.initial_balance ?? acc.initialBalance ?? 0,
          currentBalance: acc.current_balance ?? acc.currentBalance ?? 0,
          currency: acc.currency,
          createdAt: acc.created_at ?? acc.createdAt ?? "",
        }))
        const updatedTrades = updatedTradesRaw.map((trade: any) => ({
          id: trade.id,
          accountId: trade.account_id ?? trade.accountId,
          date: trade.date,
          symbol: trade.symbol,
          type: trade.type,
          lotSize: trade.lot_size ?? trade.lotSize ?? 0,
          entryPrice: trade.entry_price ?? trade.entryPrice ?? 0,
          exitPrice: trade.exit_price ?? trade.exitPrice,
          stopLoss: trade.stop_loss ?? trade.stopLoss,
          takeProfit: trade.take_profit ?? trade.takeProfit,
          pnl: trade.pnl,
          status: trade.status,
          emotion: trade.emotion,
          mistakes: trade.mistakes,
          lessons: trade.lessons,
          notes: trade.notes,
          tags: trade.tags,
          riskAmount: trade.risk_amount ?? trade.riskAmount,
          rMultiple: trade.r_multiple ?? trade.rMultiple,
          screenshot: trade.screenshot,
          screenshotUrl: trade.screenshot_url ?? trade.screenshotUrl,
        }))
        setAccounts(updatedAccounts)
        setTrades(updatedTrades)

        if (selectedAccount === accountId) setSelectedAccount("")

        toast({
          title: "Account Deleted",
          description: "Account and all associated trades have been deleted.",
        })
      } else {
        toast({
          title: "Delete Failed",
          description: "Failed to delete account. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const calculateRMultiple = (trade: Partial<Trade>) => {
    if (!trade.entryPrice || !trade.exitPrice || !trade.riskAmount || trade.riskAmount === 0) return 0

    const profit =
      trade.type === "buy"
        ? (trade.exitPrice - trade.entryPrice) * (trade.lotSize || 1)
        : (trade.entryPrice - trade.exitPrice) * (trade.lotSize || 1)

    return profit / trade.riskAmount
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentTrade.symbol || !currentTrade.type || !currentTrade.entryPrice || !selectedAccount) {
      toast({
        title: "Error",
        description: "Please fill in required fields and select an account",
        variant: "destructive",
      })
      return
    }

    const rMultiple = calculateRMultiple(currentTrade)

    const trade: Trade = {
      id: editingId || Date.now().toString(),
      accountId: selectedAccount,
      date: currentTrade.date || new Date().toISOString().split("T")[0],
      symbol: currentTrade.symbol || "",
      type: currentTrade.type as "buy" | "sell",
      lotSize: currentTrade.lotSize || 0,
      entryPrice: currentTrade.entryPrice || 0,
      exitPrice: currentTrade.exitPrice,
      stopLoss: currentTrade.stopLoss,
      takeProfit: currentTrade.takeProfit,
      pnl: currentTrade.pnl,
      status: (currentTrade.status as "open" | "closed" | "stopped") || "open",
      emotion: currentTrade.emotion || "",
      mistakes: currentTrade.mistakes || "",
      lessons: currentTrade.lessons || "",
      notes: currentTrade.notes || "",
      tags: currentTrade.tags || [],
      riskAmount: currentTrade.riskAmount,
      rMultiple: rMultiple,
      screenshotUrl: currentTrade.screenshotUrl || "",
    }

    if (editingId) {
      setTrades(trades.map((t) => (t.id === editingId ? trade : t)))
      setEditingId(null)
    } else {
      setTrades([...trades, trade])

      // Update account balance
      if (trade.pnl && trade.status === "closed") {
        setAccounts(
          accounts.map((acc) =>
            acc.id === selectedAccount ? { ...acc, currentBalance: acc.currentBalance + (trade.pnl ?? 0) } : acc,
          ),
        )
      }
    }

    setCurrentTrade({})
    setActiveTab("trades")
    toast({
      title: "Trade Saved",
      description: `${trade.symbol} trade recorded successfully!`,
    })
  }

  const addTag = () => {
    if (currentTag && !currentTrade.tags?.includes(currentTag)) {
      setCurrentTrade({
        ...currentTrade,
        tags: [...(currentTrade.tags || []), currentTag],
      })
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setCurrentTrade({
      ...currentTrade,
      tags: currentTrade.tags?.filter((tag) => tag !== tagToRemove) || [],
    })
  }

  const filteredTrades = trades.filter((trade) => {
    return (
      (filters.status === "all" || trade.status === filters.status) &&
      (filters.emotion === "all" || trade.emotion === filters.emotion) &&
      (filters.tag === "all" || trade.tags.includes(filters.tag)) &&
      (filters.winLoss === "all" || (filters.winLoss === "win" ? (trade.pnl ?? 0) > 0 : (trade.pnl ?? 0) < 0))
    )
  })

  const getStreaks = () => {
    const sortedTrades = [...trades]
      .filter((t) => t.status === "closed" && (t.pnl ?? 0) !== undefined)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    let currentStreak = 0
    let streakType = ""

    for (const trade of sortedTrades) {
      const isWin = (trade.pnl ?? 0) > 0
      if (currentStreak === 0) {
        currentStreak = 1
        streakType = isWin ? "win" : "loss"
      } else if ((streakType === "win" && isWin) || (streakType === "loss" && !isWin)) {
        currentStreak++
      } else {
        break
      }
    }

    return { currentStreak, streakType }
  }

  const getCalendarData = () => {
    const calendar: { [key: string]: number } = {}
    trades.forEach((trade) => {
      if ((trade.pnl ?? 0) !== 0 && trade.status === "closed") {
        calendar[trade.date] = (calendar[trade.date] || 0) + (trade.pnl ?? 0)
      }
    })
    return calendar
  }

  const selectedAccountData = accounts.find((acc) => acc.id === selectedAccount)
  const accountTrades = trades.filter((t) => t.accountId === selectedAccount)
  const totalPnL = accountTrades.reduce((sum, trade) => sum + (trade.pnl ?? 0), 0)
  const winningTrades = accountTrades.filter((trade) => (trade.pnl ?? 0) > 0).length
  const losingTrades = accountTrades.filter((trade) => (trade.pnl ?? 0) < 0).length
  const winRate = accountTrades.length > 0 ? ((winningTrades / accountTrades.length) * 100).toFixed(1) : 0
  const { currentStreak, streakType } = getStreaks()
  const avgRMultiple =
    accountTrades.filter((t) => t.rMultiple !== undefined).reduce((sum, t) => sum + (t.rMultiple ?? 0), 0) /
      accountTrades.filter((t) => t.rMultiple !== undefined).length || 0

  const allTags = Array.from(new Set(trades.flatMap((t) => t.tags)))
  const allEmotions = Array.from(new Set(trades.map((t) => t.emotion).filter(Boolean)))

  // Only after all hooks:
  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-4 text-center">Trading Journal Login</h2>
          <form
            onSubmit={e => {
              e.preventDefault()
              if (loginId === "admin" && loginPassword === "trading123") {
                setLoggedIn(true)
                setLoginError("")
              } else {
                setLoginError("Invalid ID or password.")
              }
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="login-id">ID</Label>
              <Input
                id="login-id"
                value={loginId}
                onChange={e => setLoginId(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div>
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            {loginError && <div className="text-red-600 text-sm">{loginError}</div>}
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? "bg-gray-900" : "bg-white"}`}>
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Trading Journal Pro
            </h1>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Professional trading journal with advanced analytics
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Sun className={`h-4 w-4 ${darkMode ? "text-gray-400" : "text-yellow-500"}`} />
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              <Moon className={`h-4 w-4 ${darkMode ? "text-blue-400" : "text-gray-400"}`} />
            </div>
          </div>
        </div>

        <div className={darkMode ? "dark" : ""}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="accounts">Accounts</TabsTrigger>
              <TabsTrigger value="add-trade">
                <Plus className="w-4 h-4 mr-2" />
                Add Trade
              </TabsTrigger>
              <TabsTrigger value="trades">Trades</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="heatmap">
                <Calendar className="w-4 h-4 mr-2" />
                Heatmap
              </TabsTrigger>
            </TabsList>

            <TabsContent value="accounts">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Trading Accounts</CardTitle>
                        <CardDescription>Manage your trading accounts</CardDescription>
                      </div>
                      <Dialog open={showAddAccount} onOpenChange={setShowAddAccount}>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Account
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Account</DialogTitle>
                            <DialogDescription>Create a new trading account</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="accountName">Account Name</Label>
                              <Input
                                id="accountName"
                                placeholder="e.g., Main Account, Demo Account"
                                value={newAccount.name}
                                onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="initialBalance">Initial Balance</Label>
                              <Input
                                id="initialBalance"
                                type="number"
                                placeholder="1000"
                                value={newAccount.initialBalance || ""}
                                onChange={(e) =>
                                  setNewAccount({
                                    ...newAccount,
                                    initialBalance: Number.parseFloat(e.target.value) || 0,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="currency">Currency</Label>
                              <Select
                                value={newAccount.currency}
                                onValueChange={(value) => setNewAccount({ ...newAccount, currency: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder={newAccount.currency} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="USD">USD</SelectItem>
                                  <SelectItem value="EUR">EUR</SelectItem>
                                  <SelectItem value="GBP">GBP</SelectItem>
                                  <SelectItem value="INR">INR</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button onClick={handleAddAccount} className="w-full">
                              Create Account
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {accounts.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No accounts created yet. Add your first account!</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {accounts.map((account) => {
                          const accountTrades = trades.filter((t) => t.accountId === account.id)
                          const accountPnL = accountTrades.reduce((sum, t) => sum + (t.pnl ?? 0), 0)
                          const roi = ((accountPnL / account.initialBalance) * 100).toFixed(2)

                          return (
                            <Card
                              key={account.id}
                              className={`cursor-pointer transition-all ${selectedAccount === account.id ? "ring-2 ring-primary" : ""}`}
                            >
                              <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <CardTitle className="text-lg">{account.name}</CardTitle>
                                    <CardDescription>{account.currency}</CardDescription>
                                  </div>
                                  <Button variant="ghost" size="sm" onClick={() => handleDeleteAccount(account.id)}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Initial:</span>
                                    <span className="font-medium">
                                      {account.currency} {account.initialBalance}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Current:</span>
                                    <span className="font-medium">
                                      {account.currency} {account.currentBalance.toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">P&L:</span>
                                    <span
                                      className={`font-bold ${accountPnL >= 0 ? "text-green-600" : "text-red-600"}`}
                                    >
                                      {account.currency} {accountPnL.toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">ROI:</span>
                                    <span
                                      className={`font-bold ${Number.parseFloat(roi) >= 0 ? "text-green-600" : "text-red-600"}`}
                                    >
                                      {roi}%
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Trades:</span>
                                    <span>{accountTrades.length}</span>
                                  </div>
                                </div>
                                <Button
                                  className="w-full mt-4"
                                  variant={selectedAccount === account.id ? "default" : "outline"}
                                  onClick={() => setSelectedAccount(account.id)}
                                >
                                  {selectedAccount === account.id ? "Selected" : "Select Account"}
                                </Button>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="add-trade">
              {!selectedAccount ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">Please select an account first to add trades.</p>
                    <Button onClick={() => setActiveTab("accounts")} className="mt-4">
                      Go to Accounts
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>{editingId ? "Edit Trade" : "Add New Trade"}</CardTitle>
                    <CardDescription>
                      Recording trade for: <strong>{selectedAccountData?.name}</strong>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="date">Date</Label>
                          <Input
                            id="date"
                            type="date"
                            value={currentTrade.date || new Date().toISOString().split("T")[0]}
                            onChange={(e) => setCurrentTrade({ ...currentTrade, date: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="symbol">Symbol *</Label>
                          <Input
                            id="symbol"
                            placeholder="e.g., BTC, XAU/USD, EUR/USD"
                            value={currentTrade.symbol || ""}
                            onChange={(e) => setCurrentTrade({ ...currentTrade, symbol: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="type">Trade Type *</Label>
                          <Select
                            value={currentTrade.type}
                            onValueChange={(value) =>
                              setCurrentTrade({ ...currentTrade, type: value as "buy" | "sell" })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="buy">Buy</SelectItem>
                              <SelectItem value="sell">Sell</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="lotSize">Lot Size</Label>
                          <Input
                            id="lotSize"
                            type="number"
                            step="0.01"
                            placeholder="0.01"
                            value={currentTrade.lotSize || ""}
                            onChange={(e) =>
                              setCurrentTrade({ ...currentTrade, lotSize: Number.parseFloat(e.target.value) || 0 })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="entryPrice">Entry Price *</Label>
                          <Input
                            id="entryPrice"
                            type="number"
                            step="0.00001"
                            placeholder="Entry price"
                            value={currentTrade.entryPrice || ""}
                            onChange={(e) =>
                              setCurrentTrade({ ...currentTrade, entryPrice: Number.parseFloat(e.target.value) || 0 })
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="exitPrice">Exit Price</Label>
                          <Input
                            id="exitPrice"
                            type="number"
                            step="0.00001"
                            placeholder="Exit price"
                            value={currentTrade.exitPrice || ""}
                            onChange={(e) =>
                              setCurrentTrade({
                                ...currentTrade,
                                exitPrice: Number.parseFloat(e.target.value) || undefined,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="stopLoss">Stop Loss</Label>
                          <Input
                            id="stopLoss"
                            type="number"
                            step="0.00001"
                            placeholder="Stop loss price"
                            value={currentTrade.stopLoss || ""}
                            onChange={(e) =>
                              setCurrentTrade({
                                ...currentTrade,
                                stopLoss: Number.parseFloat(e.target.value) || undefined,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="takeProfit">Take Profit</Label>
                          <Input
                            id="takeProfit"
                            type="number"
                            step="0.00001"
                            placeholder="Take profit price"
                            value={currentTrade.takeProfit || ""}
                            onChange={(e) =>
                              setCurrentTrade({
                                ...currentTrade,
                                takeProfit: Number.parseFloat(e.target.value) || undefined,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="riskAmount">Risk Amount ({selectedAccountData?.currency})</Label>
                          <Input
                            id="riskAmount"
                            type="number"
                            step="0.01"
                            placeholder="Amount risked"
                            value={currentTrade.riskAmount || ""}
                            onChange={(e) =>
                              setCurrentTrade({
                                ...currentTrade,
                                riskAmount: Number.parseFloat(e.target.value) || undefined,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="pnl">P&L ({selectedAccountData?.currency})</Label>
                          <Input
                            id="pnl"
                            type="number"
                            step="0.01"
                            placeholder="Profit/Loss"
                            value={currentTrade.pnl || ""}
                            onChange={(e) =>
                              setCurrentTrade({ ...currentTrade, pnl: Number.parseFloat(e.target.value) || undefined })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="status">Status</Label>
                          <Select
                            value={currentTrade.status}
                            onValueChange={(value) =>
                              setCurrentTrade({ ...currentTrade, status: value as "open" | "closed" | "stopped" })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="open">Open</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                              <SelectItem value="stopped">Stopped Out</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="emotion">Emotional State</Label>
                          <Input
                            id="emotion"
                            placeholder="e.g., Confident, Fearful, Greedy, Disciplined"
                            value={currentTrade.emotion || ""}
                            onChange={(e) => setCurrentTrade({ ...currentTrade, emotion: e.target.value })}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="screenshotUrl">Chart Screenshot URL</Label>
                        <Input
                          id="screenshotUrl"
                          placeholder="https://tradingview.com/chart/..."
                          value={currentTrade.screenshotUrl || ""}
                          onChange={(e) => setCurrentTrade({ ...currentTrade, screenshotUrl: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label>Tags</Label>
                        <div className="flex gap-2 mb-2">
                          <Input
                            placeholder="Add tag (e.g., FOMO, News Trade, High Conviction)"
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                          />
                          <Button type="button" onClick={addTag} variant="outline">
                            Add
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {currentTrade.tags?.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="cursor-pointer"
                              onClick={() => removeTag(tag)}
                            >
                              {tag} ×
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="mistakes">Mistakes Made</Label>
                        <Textarea
                          id="mistakes"
                          placeholder="What mistakes did you make? e.g., Didn't take profit at target, moved stop loss, etc."
                          value={currentTrade.mistakes || ""}
                          onChange={(e) => setCurrentTrade({ ...currentTrade, mistakes: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="lessons">Lessons Learned</Label>
                        <Textarea
                          id="lessons"
                          placeholder="What did you learn from this trade?"
                          value={currentTrade.lessons || ""}
                          onChange={(e) => setCurrentTrade({ ...currentTrade, lessons: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea
                          id="notes"
                          placeholder="Any additional notes about this trade"
                          value={currentTrade.notes || ""}
                          onChange={(e) => setCurrentTrade({ ...currentTrade, notes: e.target.value })}
                        />
                      </div>

                      {currentTrade.riskAmount && currentTrade.exitPrice && (
                        <Alert>
                          <Target className="h-4 w-4" />
                          <AlertDescription>
                            <strong>R-Multiple: {calculateRMultiple(currentTrade).toFixed(2)}R</strong>
                            {calculateRMultiple(currentTrade) > 0 ? " 🎯" : " ⚠️"}
                          </AlertDescription>
                        </Alert>
                      )}

                      <Button type="submit" className="w-full">
                        {editingId ? "Update Trade" : "Add Trade"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="trades">
              {!selectedAccount ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">Please select an account first to view trades.</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Statistics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className={`text-2xl font-bold ${totalPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {selectedAccountData?.currency} {totalPnL.toFixed(2)}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{winRate}%</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Avg R-Multiple</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className={`text-2xl font-bold ${avgRMultiple >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {avgRMultiple.toFixed(2)}R
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div
                          className={`text-2xl font-bold ${streakType === "win" ? "text-green-600" : "text-red-600"}`}
                        >
                          {currentStreak} {streakType === "win" ? "🔥" : "❄️"}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{accountTrades.length}</div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>Trades History</CardTitle>
                          <CardDescription>All trades for {selectedAccountData?.name}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              const dataStr = JSON.stringify(accountTrades, null, 2)
                              const dataBlob = new Blob([dataStr], { type: "application/json" })
                              const url = URL.createObjectURL(dataBlob)
                              const link = document.createElement("a")
                              link.href = url
                              link.download = `${selectedAccountData?.name}-trades-${new Date().toISOString().split("T")[0]}.json`
                              link.click()
                            }}
                            variant="outline"
                            size="sm"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Export
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Filters */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 border rounded-lg">
                        <div>
                          <Label>Status</Label>
                          <Select
                            value={filters.status}
                            onValueChange={(value) => setFilters({ ...filters, status: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="open">Open</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                              <SelectItem value="stopped">Stopped</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Emotion</Label>
                          <Select
                            value={filters.emotion}
                            onValueChange={(value) => setFilters({ ...filters, emotion: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              {allEmotions.map((emotion) => (
                                <SelectItem key={emotion} value={emotion}>
                                  {emotion}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Tag</Label>
                          <Select value={filters.tag} onValueChange={(value) => setFilters({ ...filters, tag: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              {allTags.map((tag) => (
                                <SelectItem key={tag} value={tag}>
                                  {tag}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Win/Loss</Label>
                          <Select
                            value={filters.winLoss}
                            onValueChange={(value) => setFilters({ ...filters, winLoss: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="win">Wins Only</SelectItem>
                              <SelectItem value="loss">Losses Only</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {filteredTrades.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No trades found matching your filters.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {filteredTrades.map((trade) => (
                            <Card key={trade.id} className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                  <Badge variant={trade.type === "buy" ? "default" : "secondary"}>
                                    {trade.type.toUpperCase()}
                                  </Badge>
                                  <h3 className="font-semibold">{trade.symbol}</h3>
                                  <span className="text-sm text-muted-foreground">{trade.date}</span>
                                  {trade.rMultiple && (
                                    <Badge variant={trade.rMultiple > 0 ? "default" : "destructive"}>
                                      {trade.rMultiple.toFixed(2)}R
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`font-bold ${(trade.pnl ?? 0) >= 0 ? "text-green-600" : "text-red-600"}`}
                                  >
                                    {(trade.pnl ?? 0) >= 0 ? (
                                      <TrendingUp className="w-4 h-4 inline mr-1" />
                                    ) : (
                                      <TrendingDown className="w-4 h-4 inline mr-1" />
                                    )}
                                    {selectedAccountData?.currency} {(trade.pnl ?? 0).toFixed(2)}
                                  </div>
                                  {trade.screenshotUrl && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => window.open(trade.screenshotUrl, "_blank")}
                                    >
                                      <Camera className="w-4 h-4" />
                                    </Button>
                                  )}
                                  <Button
                                    onClick={() => {
                                      setCurrentTrade(trade)
                                      setEditingId(trade.id)
                                      setActiveTab("add-trade")
                                    }}
                                    variant="ghost"
                                    size="sm"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      if (confirm("Delete this trade?")) {
                                        setTrades(trades.filter((t) => t.id !== trade.id))
                                      }
                                    }}
                                    variant="ghost"
                                    size="sm"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                                <div>
                                  <span className="text-muted-foreground">Lot Size:</span> {trade.lotSize}
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Entry:</span> {trade.entryPrice}
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Exit:</span> {trade.exitPrice || "N/A"}
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Status:</span>
                                  <Badge
                                    variant={
                                      trade.status === "open"
                                        ? "default"
                                        : trade.status === "closed"
                                          ? "secondary"
                                          : "destructive"
                                    }
                                    className="ml-1"
                                  >
                                    {trade.status}
                                  </Badge>
                                </div>
                              </div>

                              {trade.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {trade.tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              {(trade.emotion || trade.mistakes || trade.lessons) && (
                                <div className="space-y-2 text-sm">
                                  {trade.emotion && (
                                    <div>
                                      <span className="font-medium text-muted-foreground">Emotion:</span>{" "}
                                      {trade.emotion}
                                    </div>
                                  )}
                                  {trade.mistakes && (
                                    <div>
                                      <span className="font-medium text-muted-foreground">Mistakes:</span>{" "}
                                      {trade.mistakes}
                                    </div>
                                  )}
                                  {trade.lessons && (
                                    <div>
                                      <span className="font-medium text-muted-foreground">Lessons:</span>{" "}
                                      {trade.lessons}
                                    </div>
                                  )}
                                </div>
                              )}
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            <TabsContent value="analytics">
              {!selectedAccount ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">Please select an account first to view analytics.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Risk Management Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Account Risk</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Account Balance:</span>
                              <span className="font-medium">
                                {selectedAccountData?.currency} {selectedAccountData?.currentBalance.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Total P&L:</span>
                              <span className={`font-bold ${totalPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {selectedAccountData?.currency} {totalPnL.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>ROI:</span>
                              <span className={`font-bold ${totalPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {((totalPnL / (selectedAccountData?.initialBalance || 1)) * 100).toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3">Trade Metrics</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Avg R-Multiple:</span>
                              <span className={`font-bold ${avgRMultiple >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {avgRMultiple.toFixed(2)}R
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Win Rate:</span>
                              <span className="font-medium">{winRate}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Best Trade:</span>
                              <span className="text-green-600 font-medium">
                                {selectedAccountData?.currency}{" "}
                                {Math.max(...accountTrades.map((t) => t.pnl ?? 0)).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Worst Trade:</span>
                              <span className="text-red-600 font-medium">
                                {selectedAccountData?.currency}{" "}
                                {Math.min(...accountTrades.map((t) => t.pnl ?? 0)).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3">Streaks</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Current Streak:</span>
                              <span className={`font-bold ${streakType === "win" ? "text-green-600" : "text-red-600"}`}>
                                {currentStreak} {streakType} {streakType === "win" ? "🔥" : "❄️"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Winning Trades:</span>
                              <span className="text-green-600 font-medium">{winningTrades}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Losing Trades:</span>
                              <span className="text-red-600 font-medium">{losingTrades}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Common Mistakes</CardTitle>
                        </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {accountTrades
                            .filter((trade) => trade.mistakes)
                            .slice(0, 5)
                            .map((trade, index) => (
                              <Alert key={index}>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                  <strong>{trade.symbol}:</strong> {trade.mistakes}
                                </AlertDescription>
                              </Alert>
                            ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Key Lessons</CardTitle>
                        </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {accountTrades
                            .filter((trade) => trade.lessons)
                            .slice(0, 5)
                            .map((trade, index) => (
                              <Alert key={index}>
                                <TrendingUp className="h-4 w-4" />
                                <AlertDescription>
                                  <strong>{trade.symbol}:</strong> {trade.lessons}
                                </AlertDescription>
                              </Alert>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Emotional Patterns</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Array.from(new Set(accountTrades.map((t) => t.emotion).filter(Boolean))).map((emotion) => {
                          const emotionTrades = accountTrades.filter((t) => t.emotion === emotion)
                          const avgPnL = emotionTrades.reduce((sum, t) => sum + (t.pnl ?? 0), 0) / emotionTrades.length
                          return (
                            <div key={emotion} className="flex justify-between items-center p-3 border rounded">
                              <span className="font-medium">{emotion}</span>
                              <div className="text-right">
                                <div className={`font-bold ${avgPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
                                  Avg: {selectedAccountData?.currency} {avgPnL.toFixed(2)}
                                </div>
                                <div className="text-sm text-muted-foreground">{emotionTrades.length} trades</div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Tag Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {allTags.map((tag) => {
                          const tagTrades = accountTrades.filter((t) => t.tags.includes(tag))
                          const tagPnL = tagTrades.reduce((sum, t) => sum + (t.pnl ?? 0), 0)
                          const tagWinRate =
                            tagTrades.length > 0
                              ? ((tagTrades.filter((t) => (t.pnl ?? 0) > 0).length / tagTrades.length) * 100).toFixed(1)
                              : 0
                          return (
                            <div key={tag} className="flex justify-between items-center p-3 border rounded">
                              <div>
                                <Badge variant="outline">{tag}</Badge>
                                <span className="ml-2 text-sm text-muted-foreground">{tagTrades.length} trades</span>
                              </div>
                              <div className="text-right">
                                <div className={`font-bold ${tagPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
                                  {selectedAccountData?.currency} {tagPnL.toFixed(2)}
                                </div>
                                <div className="text-sm text-muted-foreground">Win Rate: {tagWinRate}%</div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="heatmap">
              {!selectedAccount ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">Please select an account first to view heatmap.</p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Heatmap</CardTitle>
                    <CardDescription>Daily P&L visualization for {selectedAccountData?.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-2 mb-4">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="text-center text-sm font-medium p-2">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {(() => {
                        const calendarData = getCalendarData();
                        const today = new Date();
                        const startDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
                        const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                        const days = [];
                        // Align first day of month to correct weekday
                        const firstDay = new Date(startDate);
                        const firstWeekday = firstDay.getDay();
                        for (let i = 0; i < firstWeekday; i++) {
                          days.push(<div key={"empty-" + i} className="aspect-square" />);
                        }
                        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                          // Use local date string (YYYY-MM-DD)
                          const dateStr = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
                          const pnl = calendarData[dateStr] || 0;
                          // Color scale: more intense for higher abs(pnl)
                          let bgVar = "var(--heatmap-neutral)";
                          if (pnl > 0) {
                            bgVar = pnl > 1000 ? "var(--heatmap-profit-strong)" : pnl > 100 ? "var(--heatmap-profit)" : "var(--heatmap-profit-light)";
                          } else if (pnl < 0) {
                            bgVar = pnl < -1000 ? "var(--heatmap-loss-strong)" : pnl < -100 ? "var(--heatmap-loss)" : "var(--heatmap-loss-light)";
                          }
                          days.push(
                            <div
                              key={dateStr}
                              className="aspect-square flex items-center justify-center text-xs rounded border heatmap-cell"
                              style={{ background: bgVar, color: "var(--heatmap-text)" }}
                              title={`${dateStr}: ${selectedAccountData?.currency} ${pnl.toFixed(2)}`}
                            >
                              {d.getDate()}
                            </div>
                          );
                        }
                        return days;
                      })()}
                    </div>
                    <div className="flex justify-center items-center gap-4 mt-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded heatmap-legend" style={{ background: "var(--heatmap-loss)" }}></div>
                        <span>Loss</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded heatmap-legend" style={{ background: "var(--heatmap-neutral)" }}></div>
                        <span>No Trade</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded heatmap-legend" style={{ background: "var(--heatmap-profit)" }}></div>
                        <span>Profit</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
