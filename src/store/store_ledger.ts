import axios from "axios";
import { create } from "zustand";
import { ProjectURL } from "../utilities/const";
import { StockLedger } from "../utilities/types";
import { toastError } from "../utilities/toastUtils";

interface StockLedgerState {
  stockledger: StockLedger[];
  isFetched: boolean;
  fetchStockLedgers: () => Promise<void>;
}

const DUMMY_STORAGE_KEY = "dummy_stockentry";

const useStockLedgerStore = create<StockLedgerState>((set, get) => ({
  stockledger: [],
  isFetched: false,

  fetchStockLedgers: async () => {
    const { isFetched } = get();
    if (isFetched) return;

    const isDummy = localStorage.getItem("accounttype") === "dummy";

    if (isDummy) {
      const stored = localStorage.getItem(DUMMY_STORAGE_KEY);
      const dummy: StockLedger[] = stored ? JSON.parse(stored) : [];
      set({ stockledger: dummy, isFetched: true });
    } else {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get<StockLedger[]>(
          `${ProjectURL}/api/stock-ledger`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        set({ stockledger: response.data, isFetched: true });
      } catch (error) {
        const msg = error?.response?.data?.message;
        toastError(msg);
      }
    }
  },
}));

export default useStockLedgerStore;
