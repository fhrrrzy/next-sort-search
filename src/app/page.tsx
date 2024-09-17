"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { create } from "zustand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  User,
  Shuffle,
  UserPlus,
  Loader,
  ArrowUpDown,
  Search,
  ScanLine,
  ArrowLeftRight,
  CheckCircle,
  Trash2,
  Menu,
  X,
} from "lucide-react";

const generateName = () => {
  const firstNames = [
    "Budi",
    "Siti",
    "Andi",
    "Dewi",
    "Joko",
    "Rina",
    "Agus",
    "Lina",
    "Dedi",
    "Nia",
  ];
  const lastNames = [
    "Wijaya",
    "Sari",
    "Kusuma",
    "Pratama",
    "Putri",
    "Saputra",
    "Utami",
    "Hidayat",
    "Nugraha",
    "Permata",
  ];
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${
    lastNames[Math.floor(Math.random() * lastNames.length)]
  }`;
};

interface StoreState {
  names: string[];
  inputName: string;
  searchName: string;
  errorMessage: string;
  searchError: string;
  sorting: boolean;
  searching: boolean;
  randomizing: boolean;
  currentIndex: number;
  swapMarker: number;
  pivotIndex: number;
  logs: { message: string; type: string }[];
  isSorted: boolean;
  currentStep: string;
  speed: number;
  comparisons: number;
  setNames: (names: string[]) => void;
  setInputName: (inputName: string) => void;
  setSearchName: (searchName: string) => void;
  setErrorMessage: (errorMessage: string) => void;
  setSearchError: (searchError: string) => void;
  setSorting: (sorting: boolean) => void;
  setSearching: (searching: boolean) => void;
  setRandomizing: (randomizing: boolean) => void;
  setCurrentIndex: (currentIndex: number) => void;
  setSwapMarker: (swapMarker: number) => void;
  setPivotIndex: (pivotIndex: number) => void;
  setLogs: (logs: { message: string; type: string }[]) => void;
  setIsSorted: (isSorted: boolean) => void;
  setCurrentStep: (currentStep: string) => void;
  setSpeed: (speed: number) => void;
  setComparisons: (comparisons: number) => void;
  addLog: (message: string, type: string) => void;
  incrementComparisons: () => void;
}

const useStore = create<StoreState>((set) => ({
  names: [],
  inputName: "",
  searchName: "",
  errorMessage: "",
  searchError: "",
  sorting: false,
  searching: false,
  randomizing: false,
  currentIndex: -1,
  swapMarker: -1,
  pivotIndex: -1,
  logs: [],
  isSorted: false,
  currentStep: "",
  speed: 500,
  comparisons: 0,
  setNames: (names) => set({ names }),
  setInputName: (inputName) => set({ inputName }),
  setSearchName: (searchName) => set({ searchName }),
  setErrorMessage: (errorMessage) => set({ errorMessage }),
  setSearchError: (searchError) => set({ searchError }),
  setSorting: (sorting) => set({ sorting }),
  setSearching: (searching) => set({ searching }),
  setRandomizing: (randomizing) => set({ randomizing }),
  setCurrentIndex: (currentIndex) => set({ currentIndex }),
  setSwapMarker: (swapMarker) => set({ swapMarker }),
  setPivotIndex: (pivotIndex) => set({ pivotIndex }),
  setLogs: (logs) => set({ logs }),
  setIsSorted: (isSorted) => set({ isSorted }),
  setCurrentStep: (currentStep) => set({ currentStep }),
  setSpeed: (speed) => set({ speed }),
  setComparisons: (comparisons) => set({ comparisons }),
  addLog: (message, type) =>
    set((state) => ({
      logs: [...state.logs, { message, type }],
    })),
  incrementComparisons: () =>
    set((state) => ({ comparisons: state.comparisons + 1 })),
}));

const NameBadge = ({ name, status }) => {
  const getBackgroundColor = () => {
    switch (status) {
      case "current":
        return "bg-green-200";
      case "swap":
        return "bg-yellow-200";
      case "pivot":
        return "bg-blue-200";
      case "scanning":
        return "bg-purple-200";
      case "found":
        return "bg-green-200";
      default:
        return "bg-white";
    }
  };

  const getIcon = () => {
    switch (status) {
      case "current":
        return <ScanLine className="w-4 h-4 ml-2 text-green-600" />;
      case "swap":
        return <ArrowUpDown className="w-4 h-4 ml-2 text-yellow-600" />;
      case "pivot":
        return <ArrowLeftRight className="w-4 h-4 ml-2 text-blue-600" />;
      case "scanning":
        return <ScanLine className="w-4 h-4 ml-2 text-purple-600" />;
      case "found":
        return <CheckCircle className="w-4 h-4 ml-2 text-green-600" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`inline-flex items-center justify-start px-2 py-1 m-1 border rounded-full shadow-md text-xs sm:text-sm ${getBackgroundColor()}`}
    >
      <User className="w-4 h-4 mr-1 flex-shrink-0" aria-hidden="true" />
      <span className="font-medium truncate max-w-[100px] sm:max-w-[150px]">
        {name}
      </span>
      {getIcon()}
    </motion.div>
  );
};

const LogEntry = ({ index, message, type }) => {
  const getColor = () => {
    switch (type) {
      case "swap":
        return "text-yellow-400";
      case "scan":
        return "text-blue-400";
      case "compare":
        return "text-purple-400";
      case "select":
        return "text-green-400";
      case "found":
        return "text-green-400";
      case "notFound":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className={`mb-1 font-mono text-xs ${getColor()}`}>
      <span className="text-gray-500">
        {index.toString().padStart(4, "0")}
        {" - "}
      </span>
      {message}
    </div>
  );
};

export default function Component() {
  const logRef = useRef(null);
  const [showControls, setShowControls] = useState(false);
  const {
    names,
    inputName,
    searchName,
    errorMessage,
    searchError,
    sorting,
    searching,
    randomizing,
    currentIndex,
    swapMarker,
    pivotIndex,
    logs,
    isSorted,
    currentStep,
    speed,
    comparisons,
    setNames,
    setInputName,
    setSearchName,
    setErrorMessage,
    setSearchError,
    setSorting,
    setSearching,
    setRandomizing,
    setCurrentIndex,
    setSwapMarker,
    setPivotIndex,
    setLogs,
    setIsSorted,
    setCurrentStep,
    setSpeed,
    setComparisons,
    addLog,
    incrementComparisons,
  } = useStore();

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  const addName = () => {
    if (!inputName.trim()) {
      setErrorMessage("Nama tidak boleh kosong!");
      return;
    }
    setNames([...names, inputName]);
    setInputName("");
    setErrorMessage("");
    setIsSorted(false);
    addLog(`Nama ditambahkan: ${inputName}`, "add");
  };

  const quickSort = async (arr, low, high) => {
    if (low < high) {
      setCurrentStep(`Mempartisi array dari indeks ${low} ke ${high}`);
      addLog(`Mempartisi array dari indeks ${low} ke ${high}`, "select");
      let pi = await partition(arr, low, high);
      setCurrentStep(`Elemen pivot berada di indeks ${pi}`);
      addLog(`Elemen pivot berada di indeks ${pi}`, "select");
      await quickSort(arr, low, pi - 1);
      await quickSort(arr, pi + 1, high);
    }
  };

  const partition = async (arr, low, high) => {
    let pivot = arr[high];
    setPivotIndex(high);
    setCurrentStep(`Memilih pivot: ${pivot}`);
    addLog(`Memilih pivot: ${pivot}`, "select");
    let i = low - 1;

    for (let j = low; j < high; j++) {
      setCurrentIndex(j);
      setCurrentStep(`Membandingkan ${arr[j]} dengan pivot ${pivot}`);
      addLog(`Membandingkan ${arr[j]} dengan pivot ${pivot}`, "compare");
      incrementComparisons();
      await new Promise((resolve) => setTimeout(resolve, speed));
      if (arr[j] < pivot) {
        i++;
        setSwapMarker(i);
        setCurrentStep(`Menukar ${arr[i]} dan ${arr[j]}`);
        addLog(`Menukar ${arr[i]} dan ${arr[j]}`, "swap");
        await swap(arr, i, j);
      }
    }
    setCurrentStep(`Menukar ${arr[i + 1]} dan ${arr[high]} (pivot)`);
    addLog(`Menukar ${arr[i + 1]} dan ${arr[high]} (pivot)`, "swap");
    await swap(arr, i + 1, high);
    setPivotIndex(-1);
    return i + 1;
  };

  const swap = async (arr, i, j) => {
    await new Promise((resolve) => setTimeout(resolve, speed));
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
    setNames([...arr]);
    setCurrentIndex(i);
    setSwapMarker(j);
  };

  const handleSort = async () => {
    setSorting(true);
    setLogs([]);
    setComparisons(0);
    setCurrentStep("Memulai Quick Sort");
    addLog("Memulai Quick Sort", "select");
    await quickSort([...names], 0, names.length - 1);
    setCurrentStep("Quick Sort selesai");
    addLog("Quick Sort selesai", "select");
    setSorting(false);
    setCurrentIndex(-1);
    setSwapMarker(-1);
    setPivotIndex(-1);
    setIsSorted(true);
  };

  const binarySearch = async (arr, target) => {
    setCurrentStep(`Memulai Binary Search untuk ${target}`);
    addLog(`Memulai Binary Search untuk ${target}`, "select");
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      setCurrentIndex(mid);
      setCurrentStep(`Memeriksa elemen tengah di indeks ${mid}: ${arr[mid]}`);
      addLog(`Memeriksa elemen tengah di indeks ${mid}: ${arr[mid]}`, "scan");
      incrementComparisons();
      await new Promise((resolve) => setTimeout(resolve, speed));

      if (arr[mid] === target) {
        setCurrentStep(`Ditemukan ${target} di indeks ${mid}`);
        addLog(`Ditemukan ${target} di indeks ${mid}`, "found");
        return mid;
      }
      if (arr[mid] < target) {
        setCurrentStep(`${target} lebih besar, mencari di bagian kanan`);
        addLog(`${target} lebih besar, mencari di bagian kanan`, "compare");
        left = mid + 1;
      } else {
        setCurrentStep(`${target} lebih kecil, mencari di bagian kiri`);
        addLog(`${target} lebih kecil, mencari di bagian kiri`, "compare");
        right = mid - 1;
      }
    }

    setCurrentStep(`${target} tidak ditemukan dalam daftar`);
    addLog(`${target} tidak ditemukan dalam daftar`, "notFound");
    return -1;
  };

  const handleSearch = async () => {
    if (!searchName.trim()) {
      setSearchError("Masukkan nama yang ingin dicari!");
      return;
    }

    setSearching(true);
    setLogs([]);
    setComparisons(0);
    const result = await binarySearch([...names], searchName);
    setSearching(false);
    setCurrentIndex(result !== -1 ? result : -1);
    setSearchError("");
  };

  const handleRandomize = async () => {
    setRandomizing(true);
    const shuffled = [...names].sort(() => Math.random() - 0.5);
    setNames(shuffled);
    setIsSorted(false);
    setCurrentStep("Nama diacak");
    addLog("Nama diacak", "select");
    await new Promise((resolve) => setTimeout(resolve, speed));
    setRandomizing(false);
  };

  const handleGenerate = () => {
    const generatedNames = Array.from({ length: 10 }, generateName);
    setNames([...names, ...generatedNames]);
    setIsSorted(false);
    setCurrentStep("10 nama Indonesia dihasilkan");
    addLog(`10 nama Indonesia dihasilkan`, "add");
  };

  const handleRemoveAll = () => {
    setNames([]);
    setIsSorted(false);
    setCurrentStep("Semua nama dihapus");
    addLog("Semua nama dihapus", "select");
  };

  return (
    <div className="p-4 h-screen flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Registrasi Konser</h1>
        <Button
          onClick={() => setShowControls(!showControls)}
          className="md:hidden"
          variant="outline"
          size="icon"
        >
          {showControls ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div
        className={`${
          showControls ? "block" : "hidden"
        } md:block space-y-4 mb-4`}
      >
        <div className="flex flex-col md:flex-row gap-2">
          <Input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="Masukkan nama"
            className="flex-grow"
          />
          <Button onClick={addName}>Tambahkan</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <Button onClick={handleSort} disabled={sorting || names.length < 2}>
            {sorting ? (
              <Loader className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <ArrowUpDown className="w-4 h-4 mr-2" />
            )}
            {sorting ? "Mengurutkan..." : "Urutkan"}
          </Button>
          <Button
            onClick={handleRandomize}
            disabled={sorting || searching || names.length < 2}
          >
            {randomizing ? (
              <Loader className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Shuffle className="w-4 h-4 mr-2" />
            )}
            {randomizing ? "Mengacak..." : "Acak"}
          </Button>
          <Button onClick={handleGenerate} disabled={sorting || searching}>
            <UserPlus className="w-4 h-4 mr-2" />
            Hasilkan
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-2">
          <Input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Cari nama"
            className="flex-grow"
          />
          <Button
            onClick={handleSearch}
            disabled={!isSorted || searching || sorting || names.length === 0}
          >
            {searching ? (
              <Loader className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Search className="w-4 h-4 mr-2" />
            )}
            {searching ? "Mencari..." : "Cari"}
          </Button>
        </div>

        <div>
          <h2 className="text-sm font-semibold mb-1">Kecepatan Animasi</h2>
          <Slider
            value={[speed]}
            onValueChange={(value) => setSpeed(value[0])}
            min={100}
            max={1000}
            step={100}
            className="mb-1"
          />
          <p className="text-xs text-gray-600">
            Kecepatan: {speed}ms (semakin rendah semakin cepat)
          </p>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-sm font-semibold">Jumlah Perbandingan</h2>
            <p className="text-lg font-bold">{comparisons}</p>
          </div>
          <Button
            onClick={handleRemoveAll}
            disabled={sorting || searching || names.length === 0}
            variant="destructive"
            size="sm"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Hapus Semua
          </Button>
        </div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row gap-4 overflow-hidden">
        <div className="flex-1 bg-white p-4 rounded-lg shadow overflow-y-auto">
          <h2 className="text-lg font-semibold mb-2">List Nama</h2>
          {names.length === 0 ? (
            <p className="text-sm text-gray-500">
              Belum ada nama yang ditambahkan.
            </p>
          ) : (
            <div className="flex flex-wrap">
              <AnimatePresence>
                {names.map((name, index) => (
                  <NameBadge
                    key={name + index}
                    name={name}
                    status={
                      index === currentIndex
                        ? "current"
                        : index === swapMarker
                        ? "swap"
                        : index === pivotIndex
                        ? "pivot"
                        : null
                    }
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="flex-1 bg-gray-900 p-4 rounded-lg shadow overflow-hidden">
          <h2 className="text-lg font-semibold mb-2 text-white">
            Log Algoritma
          </h2>
          <div className="text-sm mb-2 text-gray-300">{currentStep}</div>
          <div
            ref={logRef}
            className="h-full overflow-y-auto text-sm"
            style={{ maxHeight: "calc(100vh - 400px)" }}
          >
            {logs.map((log, index) => (
              <LogEntry
                key={index}
                index={index + 1}
                message={log.message}
                type={log.type}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
