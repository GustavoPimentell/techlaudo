// ====================== BANCO DE EQUIPAMENTOS (padrão) ======================
const EQUIP_ICONS = { 'Notebook':'💻', 'Desktop / PC':'🖥️', 'All-in-One':'🖥️', 'Servidor':'🗄️', 'Tablet':'📱', 'Impressora':'🖨️', 'Outro':'💡' };

const equipamentosBase = [
  // ===== DELL =====
  { tipo:'Notebook', marca:'Dell', modelo:'Inspiron 15 3520', so:'Windows 11', cpu:'Intel Core i5-1235U', ram:'8GB DDR4 3200MHz', hd:'SSD 256GB NVMe', gpu:'Intel Iris Xe Graphics', fonte:'65W', mb:'Plataforma Intel Alder Lake' },
  { tipo:'Notebook', marca:'Dell', modelo:'Inspiron 15 3511', so:'Windows 11', cpu:'Intel Core i5-1135G7', ram:'8GB DDR4 3200MHz', hd:'SSD 256GB NVMe', gpu:'NVIDIA GeForce MX350 2GB', fonte:'65W', mb:'Plataforma Intel Tiger Lake' },
  { tipo:'Notebook', marca:'Dell', modelo:'XPS 15 9520', so:'Windows 11', cpu:'Intel Core i7-12700H', ram:'16GB DDR5 4800MHz', hd:'SSD 512GB NVMe Gen4', gpu:'NVIDIA GeForce RTX 3050 Ti 4GB', fonte:'130W', mb:'Plataforma Intel Alder Lake-H' },
  { tipo:'Notebook', marca:'Dell', modelo:'XPS 13 9315', so:'Windows 11', cpu:'Intel Core i7-1250U', ram:'16GB LPDDR5', hd:'SSD 512GB NVMe', gpu:'Intel Iris Xe Graphics', fonte:'60W USB-C', mb:'Intel Alder Lake-U' },
  { tipo:'Notebook', marca:'Dell', modelo:'Latitude 5530', so:'Windows 11', cpu:'Intel Core i7-1265U', ram:'16GB DDR4', hd:'SSD 512GB NVMe', gpu:'Intel Iris Xe / MX550', fonte:'65W', mb:'Intel Alder Lake vPro' },
  { tipo:'Notebook', marca:'Dell', modelo:'Vostro 3520', so:'Windows 11', cpu:'Intel Core i3-1215U', ram:'8GB DDR4', hd:'HDD 1TB / SSD 256GB', gpu:'Intel UHD Graphics', fonte:'65W', mb:'Plataforma Intel Alder Lake' },
  { tipo:'Desktop / PC', marca:'Dell', modelo:'OptiPlex 7010', so:'Windows 11', cpu:'Intel Core i5-13500', ram:'16GB DDR4 3200MHz', hd:'SSD 256GB NVMe', gpu:'Intel UHD 770', fonte:'260W 80Plus', mb:'Intel B660 (Micro Chassis)' },
  { tipo:'Desktop / PC', marca:'Dell', modelo:'OptiPlex 3000', so:'Windows 11', cpu:'Intel Core i3-12100', ram:'8GB DDR4', hd:'HDD 1TB', gpu:'Intel UHD 730', fonte:'180W', mb:'Intel H610' },
  // ===== HP =====
  { tipo:'Notebook', marca:'HP', modelo:'Pavilion 15-eg3', so:'Windows 11', cpu:'Intel Core i5-1335U', ram:'8GB DDR4 3200MHz', hd:'SSD 256GB NVMe', gpu:'Intel Iris Xe Graphics', fonte:'65W', mb:'Intel Raptor Lake-U' },
  { tipo:'Notebook', marca:'HP', modelo:'Notebook 15-fd', so:'Windows 11', cpu:'Intel Core i3-N305', ram:'8GB DDR4', hd:'SSD 256GB', gpu:'Intel UHD Graphics', fonte:'45W', mb:'Intel Alder Lake-N' },
  { tipo:'Notebook', marca:'HP', modelo:'EliteBook 840 G9', so:'Windows 11', cpu:'Intel Core i7-1255U', ram:'16GB DDR5', hd:'SSD 512GB NVMe', gpu:'Intel Iris Xe vPro', fonte:'65W', mb:'Intel Alder Lake-U vPro' },
  { tipo:'Notebook', marca:'HP', modelo:'Victus 15', so:'Windows 11', cpu:'AMD Ryzen 5 7535HS', ram:'8GB DDR5 4800MHz', hd:'SSD 512GB NVMe', gpu:'NVIDIA GeForce RTX 2050 4GB', fonte:'150W', mb:'AMD Rembrandt-H' },
  { tipo:'Notebook', marca:'HP', modelo:'ProBook 445 G9', so:'Windows 11', cpu:'AMD Ryzen 5 5625U', ram:'8GB DDR4', hd:'SSD 256GB', gpu:'AMD Radeon Vega 7', fonte:'65W', mb:'AMD Cezanne' },
  { tipo:'Desktop / PC', marca:'HP', modelo:'Prodesk 400 G9', so:'Windows 11', cpu:'Intel Core i5-12500', ram:'8GB DDR4', hd:'SSD 256GB + HDD 1TB', gpu:'Intel UHD 770', fonte:'260W', mb:'Intel H610' },
  // ===== LENOVO =====
  { tipo:'Notebook', marca:'Lenovo', modelo:'IdeaPad 3i 15', so:'Windows 11', cpu:'Intel Core i5-1235U', ram:'8GB DDR4 3200MHz', hd:'SSD 256GB NVMe', gpu:'Intel Iris Xe Graphics', fonte:'65W', mb:'Intel Alder Lake-U' },
  { tipo:'Notebook', marca:'Lenovo', modelo:'ThinkPad E15 Gen 4', so:'Windows 11', cpu:'Intel Core i5-1235U', ram:'16GB DDR4', hd:'SSD 512GB NVMe', gpu:'Intel Iris Xe', fonte:'65W', mb:'Intel Alder Lake vPro' },
  { tipo:'Notebook', marca:'Lenovo', modelo:'ThinkPad X1 Carbon Gen 11', so:'Windows 11', cpu:'Intel Core i7-1365U', ram:'32GB LPDDR5', hd:'SSD 1TB NVMe Gen4', gpu:'Intel Iris Xe vPro', fonte:'65W USB-C', mb:'Intel Raptor Lake-U vPro' },
  { tipo:'Notebook', marca:'Lenovo', modelo:'Legion 5 Gen 8', so:'Windows 11', cpu:'AMD Ryzen 7 7745HX', ram:'16GB DDR5 4800MHz', hd:'SSD 512GB NVMe Gen4', gpu:'NVIDIA GeForce RTX 4060 8GB', fonte:'230W', mb:'AMD Dragon Range' },
  { tipo:'Notebook', marca:'Lenovo', modelo:'IdeaPad Gaming 3i', so:'Windows 11', cpu:'Intel Core i5-12450H', ram:'8GB DDR4', hd:'SSD 512GB NVMe', gpu:'NVIDIA GeForce RTX 3050 4GB', fonte:'170W', mb:'Intel Alder Lake-H' },
  { tipo:'Desktop / PC', marca:'Lenovo', modelo:'ThinkCentre M70q Gen3', so:'Windows 11', cpu:'Intel Core i5-12400T', ram:'8GB DDR4', hd:'SSD 256GB NVMe', gpu:'Intel UHD 730', fonte:'65W (Tiny)', mb:'Intel H610' },
  // ===== ACER =====
  { tipo:'Notebook', marca:'Acer', modelo:'Aspire 5 A515', so:'Windows 11', cpu:'AMD Ryzen 5 7530U', ram:'8GB DDR4 3200MHz', hd:'SSD 512GB NVMe', gpu:'AMD Radeon Vega 7', fonte:'65W', mb:'AMD Barcelo-U' },
  { tipo:'Notebook', marca:'Acer', modelo:'Nitro 5 AN515', so:'Windows 11', cpu:'Intel Core i5-12500H', ram:'8GB DDR4', hd:'SSD 512GB NVMe', gpu:'NVIDIA GeForce RTX 3050 4GB', fonte:'180W', mb:'Intel Alder Lake-H' },
  { tipo:'Notebook', marca:'Acer', modelo:'Swift X SFX16', so:'Windows 11', cpu:'Intel Core i7-12700H', ram:'16GB LPDDR5', hd:'SSD 1TB NVMe', gpu:'NVIDIA GeForce RTX 3050 Ti 4GB', fonte:'100W USB-C', mb:'Intel Alder Lake-H' },
  { tipo:'Notebook', marca:'Acer', modelo:'Chromebook 315', so:'Ubuntu / Linux', cpu:'Intel Celeron N4020', ram:'4GB DDR4', hd:'eMMC 64GB', gpu:'Intel UHD Graphics 600', fonte:'45W USB-C', mb:'Intel Gemini Lake' },
  // ===== ASUS =====
  { tipo:'Notebook', marca:'Asus', modelo:'VivoBook 15 X1502', so:'Windows 11', cpu:'Intel Core i5-1235U', ram:'8GB DDR4 3200MHz', hd:'SSD 512GB NVMe', gpu:'Intel Iris Xe Graphics', fonte:'65W', mb:'Intel Alder Lake-U' },
  { tipo:'Notebook', marca:'Asus', modelo:'ZenBook 14 UX3402', so:'Windows 11', cpu:'Intel Core i7-1265U', ram:'16GB LPDDR5', hd:'SSD 512GB NVMe', gpu:'Intel Iris Xe Graphics', fonte:'65W USB-C', mb:'Intel Alder Lake-U' },
  { tipo:'Notebook', marca:'Asus', modelo:'ROG Strix G15', so:'Windows 11', cpu:'AMD Ryzen 9 6900HX', ram:'16GB DDR5 4800MHz', hd:'SSD 1TB NVMe Gen4', gpu:'NVIDIA GeForce RTX 3070 Ti 8GB', fonte:'240W', mb:'AMD Rembrandt-H' },
  { tipo:'Notebook', marca:'Asus', modelo:'TUF Gaming F15', so:'Windows 11', cpu:'Intel Core i5-12500H', ram:'8GB DDR4', hd:'SSD 512GB NVMe', gpu:'NVIDIA GeForce RTX 3050 4GB', fonte:'180W', mb:'Intel Alder Lake-H' },
  { tipo:'Desktop / PC', marca:'Asus', modelo:'ROG Strix G15DS', so:'Windows 11', cpu:'AMD Ryzen 7 7700X', ram:'16GB DDR5 5200MHz', hd:'SSD 1TB NVMe Gen4', gpu:'NVIDIA GeForce RTX 4060 8GB', fonte:'650W 80Plus Gold', mb:'ASUS ROG B650' },
  // ===== APPLE =====
  { tipo:'Notebook', marca:'Apple', modelo:'MacBook Pro 14" M3', so:'macOS', cpu:'Apple M3 (8-core CPU)', ram:'8GB Unified Memory', hd:'SSD 512GB', gpu:'Apple M3 GPU 10-core', fonte:'70W MagSafe 3', mb:'Apple Silicon M3' },
  { tipo:'Notebook', marca:'Apple', modelo:'MacBook Pro 16" M3 Pro', so:'macOS', cpu:'Apple M3 Pro (12-core CPU)', ram:'18GB Unified Memory', hd:'SSD 512GB', gpu:'Apple M3 Pro GPU 18-core', fonte:'140W MagSafe 3', mb:'Apple Silicon M3 Pro' },
  { tipo:'Notebook', marca:'Apple', modelo:'MacBook Air 13" M2', so:'macOS', cpu:'Apple M2 (8-core CPU)', ram:'8GB Unified Memory', hd:'SSD 256GB', gpu:'Apple M2 GPU 8-core', fonte:'30W USB-C', mb:'Apple Silicon M2' },
  { tipo:'Notebook', marca:'Apple', modelo:'MacBook Air 15" M3', so:'macOS', cpu:'Apple M3 (8-core CPU)', ram:'8GB Unified Memory', hd:'SSD 256GB', gpu:'Apple M3 GPU 10-core', fonte:'35W Dual USB-C', mb:'Apple Silicon M3' },
  // ===== SAMSUNG =====
  { tipo:'Notebook', marca:'Samsung', modelo:'Galaxy Book3 360', so:'Windows 11', cpu:'Intel Core i5-1335U', ram:'8GB LPDDR4X', hd:'SSD 256GB NVMe', gpu:'Intel Iris Xe Graphics', fonte:'65W USB-C', mb:'Intel Raptor Lake-U' },
  { tipo:'Notebook', marca:'Samsung', modelo:'Galaxy Book3 Pro 360', so:'Windows 11', cpu:'Intel Core i7-1360P', ram:'16GB LPDDR5', hd:'SSD 512GB NVMe', gpu:'Intel Iris Xe Evo', fonte:'65W USB-C', mb:'Intel Raptor Lake-P' },
  // ===== SERVIDORES =====
  { tipo:'Servidor', marca:'Dell', modelo:'PowerEdge T40', so:'Sem SO', cpu:'Intel Xeon E-2224G (4-core)', ram:'8GB ECC DDR4', hd:'HDD 1TB SATA', gpu:'Matrox G200', fonte:'300W', mb:'Dell PowerEdge T40 Chipset' },
  { tipo:'Servidor', marca:'Dell', modelo:'PowerEdge R650', so:'Sem SO', cpu:'Intel Xeon Silver 4314 (16-core)', ram:'32GB DDR4 ECC RDIMM', hd:'SSD 480GB SATA + HDD 2TB', gpu:'Matrox G200eR3', fonte:'600W Redundante', mb:'Dell EMC PowerEdge R650' },
  { tipo:'Servidor', marca:'HP', modelo:'ProLiant ML110 Gen10', so:'Sem SO', cpu:'Intel Xeon Bronze 3206R (8-core)', ram:'16GB DDR4 ECC', hd:'HDD 1TB SATA', gpu:'Matrox G200', fonte:'350W', mb:'HP ProLiant ML110 Gen10' },
  { tipo:'Servidor', marca:'Lenovo', modelo:'ThinkSystem ST50 V2', so:'Sem SO', cpu:'Intel Xeon E-2356G (6-core)', ram:'16GB DDR4 ECC', hd:'SSD 480GB + HDD 2TB', gpu:'AST2500', fonte:'500W 80Plus Platinum', mb:'Lenovo ThinkSystem ST50 V2' },
];

// ====================== DATA ======================
let laudos = JSON.parse(localStorage.getItem('laudos') || '[]');
let orcamentos = JSON.parse(localStorage.getItem('orcamentos') || '[]');
let configs = JSON.parse(localStorage.getItem('configs') || '{}');
let checklistPadrao = JSON.parse(localStorage.getItem('checklistPadrao') || 'null') || [
  "Teclado funcional", "Touchpad funcional", "Display sem riscos", "Bateria carregando",
  "USB funcionando", "HDMI / saídas de vídeo", "Leitor de cartão", "Webcam funcionando",
  "Microfone / Alto-falantes", "Wifi / Bluetooth", "HD / SSD detectado", "Sistema inicia normalmente",
  "Ventilação / cooler limpos", "Pasta térmica aplicada", "Drives ópticos"
];
let laudoAtivo = null;
let itemCounter = 0;
let checklistAtual = {};

