"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  User,
  Shuffle,
  UserPlus,
  Loader,
  ArrowUpDown,
  Search,
  Trash2,
} from "lucide-react";
import { faker } from "@faker-js/faker/locale/id_ID";

const NameBadge = ({ name, status }) => {
  const getBadgeColor = () => {
    switch (status) {
      case "comparing":
        return "bg-yellow-400 text-black"; // Comparing
      case "scanning":
        return "bg-orange-400 text-black"; // Scanning during search
      case "found":
        return "bg-green-400 text-white"; // Found name
      case "notFound":
        return "bg-red-400 text-white"; // Name not found
      default:
        return "bg-white border-2 border-gray-200"; // Default state
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`inline-flex items-center justify-start px-3 py-2 m-1 rounded-full shadow-md ${getBadgeColor()}`}
    >
      <User className="w-5 h-5 mr-2 flex-shrink-0" aria-hidden="true" />
      <span className="text-sm font-medium">{name}</span>
    </motion.div>
  );
};

const LogEntry = ({ index, message, type }) => {
  const getColor = () => {
    switch (type) {
      case "swap":
        return "text-blue-400";
      case "scan":
        return "text-yellow-400";
      case "compare":
        return "text-orange-400";
      case "select":
        return "text-purple-400";
      case "found":
        return "text-green-400";
      case "notFound":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className={`mb-1 font-mono text-sm ${getColor()}`}>
      <span className="text-gray-500">
        {index.toString().padStart(4, "0")}
        {" - "}
      </span>
      {message}
    </div>
  );
};

export default function Component() {
  const [names, setNames] = useState([]);
  const [inputName, setInputName] = useState("");
  const [searchName, setSearchName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchError, setSearchError] = useState("");
  const [sorting, setSorting] = useState(false);
  const [searching, setSearching] = useState(false);
  const [randomizing, setRandomizing] = useState(false);
  const [highlightedIndices, setHighlightedIndices] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isSorted, setIsSorted] = useState(false);
  const [currentStep, setCurrentStep] = useState("");
  const [speed, setSpeed] = useState(500);
  const [comparisons, setComparisons] = useState(0);
  const logRef = useRef(null);

  const addName = useCallback(() => {
    if (!inputName.trim()) {
      setErrorMessage("Nama tidak boleh kosong!");
      return;
    }
    setNames((prevNames) => [...prevNames, inputName]);
    setInputName("");
    setErrorMessage("");
    setIsSorted(false);
    addLog(`Nama ditambahkan: ${inputName}`, "add");
  }, [inputName]);

  const addLog = useCallback((message, type) => {
    setLogs((prevLogs) => [...prevLogs, { message, type }]);
    setTimeout(() => {
      if (logRef.current) {
        logRef.current.scrollTop = logRef.current.scrollHeight;
      }
    }, 0);
  }, []);

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
    setCurrentStep(`Memilih pivot: ${pivot}`);
    addLog(`Memilih pivot: ${pivot}`, "select");
    let i = low - 1;

    for (let j = low; j < high; j++) {
      setHighlightedIndices([j, high]);
      setCurrentStep(`Membandingkan ${arr[j]} dengan pivot ${pivot}`);
      addLog(`Membandingkan ${arr[j]} dengan pivot ${pivot}`, "compare");
      setComparisons((prev) => prev + 1);
      await new Promise((resolve) => setTimeout(resolve, speed));
      if (arr[j] < pivot) {
        i++;
        setCurrentStep(`Menukar ${arr[i]} dan ${arr[j]}`);
        addLog(`Menukar ${arr[i]} dan ${arr[j]}`, "swap");
        await swap(arr, i, j);
      }
    }
    setCurrentStep(`Menukar ${arr[i + 1]} dan ${arr[high]} (pivot)`);
    addLog(`Menukar ${arr[i + 1]} dan ${arr[high]} (pivot)`, "swap");
    await swap(arr, i + 1, high);
    return i + 1;
  };

  const swap = async (arr, i, j) => {
    await new Promise((resolve) => setTimeout(resolve, speed));
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
    setNames([...arr]);
    setHighlightedIndices([i, j]);
  };

  const handleSort = async () => {
    setSorting(true);
    setLogs([]);
    setComparisons(0);
    setCurrentStep("Memulai Quick Sort");
    addLog("Memulai Quick Sort", "select");
    await quickSort(names, 0, names.length - 1);
    setCurrentStep("Quick Sort selesai");
    addLog("Quick Sort selesai", "select");
    setSorting(false);
    setHighlightedIndices([]);
    setIsSorted(true);
  };

  const binarySearch = async (arr, target) => {
    setCurrentStep(`Memulai Binary Search untuk ${target}`);
    addLog(`Memulai Binary Search untuk ${target}`, "select");
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      setHighlightedIndices([mid]);
      setCurrentStep(`Memeriksa elemen tengah di indeks ${mid}: ${arr[mid]}`);
      addLog(`Memeriksa elemen tengah di indeks ${mid}: ${arr[mid]}`, "scan");
      setComparisons((prev) => prev + 1);
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
    const result = await binarySearch(names, searchName);
    setSearching(false);
    setHighlightedIndices(result !== -1 ? [result] : []);
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
    const generatedNames = Array.from({ length: 10 }, () =>
      faker.person.fullName()
    );
    setNames((prevNames) => [...prevNames, ...generatedNames]);
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
    <motion.div
      className="p-4 max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Registrasi Konser</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            className="flex mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Input
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              placeholder="Masukkan nama"
              className="mr-2"
            />
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button onClick={addName}>Tambahkan</Button>
            </motion.div>
          </motion.div>

          {errorMessage && (
            <motion.p
              className="text-red-500 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errorMessage}
            </motion.p>
          )}

          <motion.div
            className="mb-4 flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                onClick={handleSort}
                disabled={sorting || names.length < 2}
              >
                {sorting ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <Loader className="w-4 h-4" />
                    </motion.span>
                    Mengurutkan...
                  </>
                ) : (
                  <>
                    <ArrowUpDown className="w-4 h-4" />
                    Urutkan Nama
                  </>
                )}
              </Button>
            </motion.div>
            <Input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Cari nama"
              className="mr-2"
            />
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                onClick={handleSearch}
                disabled={
                  !isSorted || searching || sorting || names.length === 0
                }
                className="flex items-center justify-center"
              >
                {searching ? (
                  <>
                    <motion.span
                      className="flex items-center justify-center"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <Loader className="w-4 h-4" />
                    </motion.span>
                    <span className="ml-2">Mencari...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Cari
                  </>
                )}
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                onClick={handleRandomize}
                disabled={sorting || searching || names.length < 2}
                className="flex items-center justify-center"
              >
                {randomizing ? (
                  <>
                    <motion.span
                      className="flex items-center justify-center"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <Loader className="w-4 h-4" />
                    </motion.span>
                    <span className="ml-2">Mengacak...</span>
                  </>
                ) : (
                  <>
                    <Shuffle className="w-4 h-4 mr-2" />
                    Acak Nama
                  </>
                )}
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button onClick={handleGenerate} disabled={sorting || searching}>
                <UserPlus className="w-4 h-4 mr-2" />
                Hasilkan Nama
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                onClick={handleRemoveAll}
                disabled={sorting || searching || names.length === 0}
                variant="destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Hapus Semua Nama
              </Button>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>

      {searchError && (
        <motion.p
          className="text-red-500 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {searchError}
        </motion.p>
      )}

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Kecepatan Animasi</CardTitle>
        </CardHeader>
        <CardContent>
          <Slider
            value={[speed]}
            onValueChange={(value) => setSpeed(value[0])}
            min={100}
            max={1000}
            step={100}
            className="mb-2"
          />
          <p className="text-sm text-gray-600">
            Kecepatan: {speed}ms (semakin rendah semakin cepat)
          </p>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Langkah Saat Ini</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{currentStep}</p>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Jumlah Perbandingan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{comparisons}</p>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>List Nama</CardTitle>
        </CardHeader>
        <CardContent>
          {names.length === 0 ? (
            <p className="text-sm text-gray-500">
              Belum ada nama yang ditambahkan.
            </p>
          ) : (
            <motion.div className="flex flex-wrap">
              <AnimatePresence>
                {names.map((name, index) => (
                  <motion.div
                    key={name + index}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                      duration: 0.5,
                    }}
                  >
                    <NameBadge
                      name={name}
                      status={
                        highlightedIndices.includes(index)
                          ? searching
                            ? highlightedIndices.length === 1
                              ? "found"
                              : "scanning"
                            : "comparing"
                          : null
                      }
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Log Algoritma</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            ref={logRef}
            className="h-64 overflow-y-auto text-sm bg-gray-900 p-4 rounded-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {logs.map((log, index) => (
              <LogEntry
                key={index}
                index={index + 1}
                message={log.message}
                type={log.type}
              />
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
