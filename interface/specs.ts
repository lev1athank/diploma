// Общий тип для всех компонентов
export interface HardwareComponent {
  slug: string;
  name: string;
  specifications: CPUSpecs | GPUSpecs | MemoryData | MotherboardData;
}

// Специфичные характеристики Процессора
export interface CPUSpecs {
  clock_speed?: string;
  turbo_speed?: string;
  cores?: string;
  threads?: string;
  l1_cache?: string;
  l2_cache?: string; // на будущее
  l3_cache?: string;
  pcie_revision?: string;
  pcie_lanes?: string;
  socket?: string;
  family?: string;
  memory_type?: string;
  memory_channels?: string;
  max_memory?: string;
  release_date?: string;
  has_unlocked_multiplier?: string;
  tdp?: string;
  [key: string]: string | undefined; // Индексная сигнатура для прочих полей
}

// Специфичные характеристики Видеокарты
export interface GPUSpecs {
  core_clock?: string;
  boost_clock?: string;
  memory_type?: string;
  memory_size?: string;
  bus_width?: string;
  memory_bandwidth?: string;
  tdp?: string;
  floating_point_performance?: string;
  release_date?: string;
  family?: string;
  pcie_revision?: string;
  directx_support?: string;
  opengl_support?: string;
  pixel_rate?: string;
  texture_rate?: string;
  shading_units?: string;
  texture_mapping_units?: string;
  render_output_processors?: string;
  [key: string]: string | undefined; // Чтобы можно было парсить любые данные из таблицы
}

export interface MemoryData {
    speed: [number, number];
    modules: [number, number];
    cas_latency: number;
    color: string;
}

export interface MotherboardData {
    socket: string;
    form_factor: string;
    max_memory: number;
    memory_slots: number;
}

// Интерфейс ответа от твоего API
export interface ApiResponse {
  source: string;
  data: HardwareComponent[];
}