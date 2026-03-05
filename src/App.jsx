import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import * as d3 from "d3";

// ═══════════════════════════════════════
//  85 AIRCRAFT — ATR · Embraer · COMAC · Airbus · Boeing
// ═══════════════════════════════════════
const ALL_AIRCRAFT = [
  {id:"boeing-247",name:"Boeing 247",maker:"Boeing",fam:"Boeing 247",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"boeing-307-stratoliner",name:"Boeing 307 Stratoliner",maker:"Boeing",fam:"Boeing 307",cat:"regional",seats:33,range:2490,speed:840,fuelL100:332,price:8250000,maint:4980,crew:2325},
  {id:"boeing-314-clipper-hydravion",name:"Boeing 314 Clipper (hydravion)",maker:"Boeing",fam:"Boeing 314",cat:"regional",seats:74,range:3720,speed:840,fuelL100:496,price:18500000,maint:7440,crew:3350},
  {id:"boeing-367-80-dash-80-proto",name:"Boeing 367-80 (Dash 80, proto)",maker:"Boeing",fam:"Boeing 367-80",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"boeing-707-120",name:"Boeing 707-120",maker:"Boeing",fam:"Boeing 707-120",cat:"narrow",seats:179,range:7080,speed:840,fuelL100:1339,price:14320000,maint:12160,crew:6080},
  {id:"boeing-707-120b",name:"Boeing 707-120B",maker:"Boeing",fam:"Boeing 707-120B",cat:"narrow",seats:179,range:7080,speed:840,fuelL100:1339,price:14320000,maint:12160,crew:6080},
  {id:"boeing-707-320",name:"Boeing 707-320",maker:"Boeing",fam:"Boeing 707-320",cat:"narrow",seats:189,range:7280,speed:840,fuelL100:1387,price:15120000,maint:12560,crew:6280},
  {id:"boeing-707-320b",name:"Boeing 707-320B",maker:"Boeing",fam:"Boeing 707-320B",cat:"narrow",seats:189,range:7280,speed:840,fuelL100:1387,price:15120000,maint:12560,crew:6280},
  {id:"boeing-707-320c",name:"Boeing 707-320C",maker:"Boeing",fam:"Boeing 707-320C",cat:"narrow",seats:189,range:7280,speed:840,fuelL100:1387,price:15120000,maint:12560,crew:6280},
  {id:"boeing-720",name:"Boeing 720",maker:"Boeing",fam:"Boeing 720",cat:"narrow",seats:149,range:6480,speed:840,fuelL100:1195,price:11920000,maint:10960,crew:5480},
  {id:"boeing-720b",name:"Boeing 720B",maker:"Boeing",fam:"Boeing 720B",cat:"narrow",seats:149,range:6480,speed:840,fuelL100:1195,price:11920000,maint:10960,crew:5480},
  {id:"boeing-717-200",name:"Boeing 717-200",maker:"Boeing",fam:"Boeing 717-200",cat:"narrow",seats:117,range:5840,speed:840,fuelL100:651,price:9360000,maint:9680,crew:4840},
  {id:"boeing-727-100",name:"Boeing 727-100",maker:"Boeing",fam:"Boeing 727-100",cat:"narrow",seats:131,range:6120,speed:840,fuelL100:1108,price:10480000,maint:10240,crew:5120},
  {id:"boeing-727-200",name:"Boeing 727-200",maker:"Boeing",fam:"Boeing 727-200",cat:"narrow",seats:163,range:6760,speed:840,fuelL100:1262,price:13040000,maint:11520,crew:5760},
  {id:"boeing-737-100",name:"Boeing 737-100",maker:"Boeing",fam:"Boeing 737-100",cat:"regional",seats:103,range:4590,speed:840,fuelL100:612,price:25750000,maint:9180,crew:4075},
  {id:"boeing-737-200",name:"Boeing 737-200",maker:"Boeing",fam:"Boeing 737-200",cat:"narrow",seats:130,range:6100,speed:840,fuelL100:897,price:10400000,maint:10200,crew:5100},
  {id:"boeing-737-200c",name:"Boeing 737-200C",maker:"Boeing",fam:"Boeing 737-200C",cat:"narrow",seats:130,range:6100,speed:840,fuelL100:897,price:10400000,maint:10200,crew:5100},
  {id:"boeing-737-300",name:"Boeing 737-300",maker:"Boeing",fam:"Boeing 737-300",cat:"narrow",seats:149,range:6480,speed:840,fuelL100:971,price:11920000,maint:10960,crew:5480},
  {id:"boeing-737-400",name:"Boeing 737-400",maker:"Boeing",fam:"Boeing 737-400",cat:"narrow",seats:159,range:6680,speed:840,fuelL100:1010,price:12720000,maint:11360,crew:5680},
  {id:"boeing-737-500",name:"Boeing 737-500",maker:"Boeing",fam:"Boeing 737-500",cat:"narrow",seats:122,range:5940,speed:840,fuelL100:865,price:9760000,maint:9880,crew:4940},
  {id:"boeing-737-600",name:"Boeing 737-600",maker:"Boeing",fam:"Boeing 737-600",cat:"narrow",seats:110,range:5700,speed:840,fuelL100:630,price:8800000,maint:9400,crew:4700},
  {id:"boeing-737-700",name:"Boeing 737-700",maker:"Boeing",fam:"Boeing 737-700",cat:"narrow",seats:128,range:6060,speed:840,fuelL100:684,price:10240000,maint:10120,crew:5060},
  {id:"boeing-737-700c",name:"Boeing 737-700C",maker:"Boeing",fam:"Boeing 737-700C",cat:"narrow",seats:128,range:6060,speed:840,fuelL100:684,price:10240000,maint:10120,crew:5060},
  {id:"boeing-737-800",name:"Boeing 737-800",maker:"Boeing",fam:"Boeing 737-800",cat:"narrow",seats:189,range:5765,speed:842,fuelL100:600,price:15000000,maint:9000,crew:3700},
  {id:"boeing-737-900",name:"Boeing 737-900",maker:"Boeing",fam:"Boeing 737-900",cat:"narrow",seats:177,range:7040,speed:840,fuelL100:831,price:14160000,maint:12080,crew:6040},
  {id:"boeing-737-900er",name:"Boeing 737-900ER",maker:"Boeing",fam:"Boeing 737-900ER",cat:"narrow",seats:177,range:7040,speed:840,fuelL100:831,price:14160000,maint:12080,crew:6040},
  {id:"boeing-737-max-7",name:"Boeing 737 MAX 7",maker:"Boeing",fam:"Boeing 737",cat:"narrow",seats:138,range:6260,speed:840,fuelL100:714,price:11040000,maint:10520,crew:5260},
  {id:"boeing-737-max-8",name:"Boeing 737 MAX 8",maker:"Boeing",fam:"Boeing 737",cat:"narrow",seats:162,range:6740,speed:840,fuelL100:786,price:12960000,maint:11480,crew:5740},
  {id:"boeing-737-max-9",name:"Boeing 737 MAX 9",maker:"Boeing",fam:"Boeing 737",cat:"narrow",seats:178,range:7060,speed:840,fuelL100:834,price:14240000,maint:12120,crew:6060},
  {id:"boeing-737-max-10",name:"Boeing 737 MAX 10",maker:"Boeing",fam:"Boeing 737",cat:"narrow",seats:188,range:7260,speed:840,fuelL100:864,price:15040000,maint:12520,crew:6260},
  {id:"boeing-747-100",name:"Boeing 747-100",maker:"Boeing",fam:"Boeing 747-100",cat:"jumbo",seats:366,range:11830,speed:905,fuelL100:3349,price:45980000,maint:35980,crew:22320},
  {id:"boeing-747-100b",name:"Boeing 747-100B",maker:"Boeing",fam:"Boeing 747-100B",cat:"jumbo",seats:366,range:11830,speed:905,fuelL100:3349,price:45980000,maint:35980,crew:22320},
  {id:"boeing-747-100sr",name:"Boeing 747-100SR",maker:"Boeing",fam:"Boeing 747-100SR",cat:"jumbo",seats:498,range:12490,speed:905,fuelL100:3547,price:49940000,maint:39940,crew:24960},
  {id:"boeing-747-200b",name:"Boeing 747-200B",maker:"Boeing",fam:"Boeing 747-200B",cat:"jumbo",seats:452,range:12260,speed:905,fuelL100:3478,price:48560000,maint:38560,crew:24040},
  {id:"boeing-747-200c",name:"Boeing 747-200C",maker:"Boeing",fam:"Boeing 747-200C",cat:"jumbo",seats:452,range:12260,speed:905,fuelL100:3478,price:48560000,maint:38560,crew:24040},
  {id:"boeing-747-200f",name:"Boeing 747-200F",maker:"Boeing",fam:"Boeing 747-200F",cat:"jumbo",seats:50,range:10250,speed:905,fuelL100:2875,price:36500000,maint:26500,crew:16000},
  {id:"boeing-747sp",name:"Boeing 747SP",maker:"Boeing",fam:"Boeing 747SP",cat:"wide",seats:316,range:12740,speed:880,fuelL100:2464,price:40280000,maint:19480,crew:12320},
  {id:"boeing-747-300",name:"Boeing 747-300",maker:"Boeing",fam:"Boeing 747-300",cat:"jumbo",seats:400,range:12000,speed:905,fuelL100:3400,price:47000000,maint:37000,crew:23000},
  {id:"boeing-747-400",name:"Boeing 747-400",maker:"Boeing",fam:"Boeing 747-400",cat:"jumbo",seats:416,range:12080,speed:905,fuelL100:3424,price:47480000,maint:37480,crew:23320},
  {id:"boeing-747-400d",name:"Boeing 747-400D",maker:"Boeing",fam:"Boeing 747-400D",cat:"jumbo",seats:568,range:12840,speed:905,fuelL100:3652,price:52040000,maint:42040,crew:26360},
  {id:"boeing-747-400er",name:"Boeing 747-400ER",maker:"Boeing",fam:"Boeing 747-400ER",cat:"jumbo",seats:416,range:12080,speed:905,fuelL100:3424,price:47480000,maint:37480,crew:23320},
  {id:"boeing-747-8i",name:"Boeing 747-8I",maker:"Boeing",fam:"Boeing 747-8I",cat:"jumbo",seats:467,range:12335,speed:905,fuelL100:3500,price:49010000,maint:39010,crew:24340},
  {id:"boeing-747-8f",name:"Boeing 747-8F",maker:"Boeing",fam:"Boeing 747-8F",cat:"jumbo",seats:50,range:10250,speed:905,fuelL100:2875,price:36500000,maint:26500,crew:16000},
  {id:"boeing-747-500x-annul",name:"Boeing 747-500X (annulé)",maker:"Boeing",fam:"Boeing 747-500X",cat:"jumbo",seats:462,range:12310,speed:905,fuelL100:3493,price:48860000,maint:38860,crew:24240},
  {id:"boeing-747-600x-annul",name:"Boeing 747-600X (annulé)",maker:"Boeing",fam:"Boeing 747-600X",cat:"jumbo",seats:548,range:12740,speed:905,fuelL100:3622,price:51440000,maint:41440,crew:25960},
  {id:"boeing-757-200",name:"Boeing 757-200",maker:"Boeing",fam:"Boeing 757-200",cat:"wide",seats:228,range:11420,speed:880,fuelL100:2534,price:33240000,maint:16840,crew:10560},
  {id:"boeing-757-300",name:"Boeing 757-300",maker:"Boeing",fam:"Boeing 757-300",cat:"wide",seats:243,range:11645,speed:880,fuelL100:2606,price:34440000,maint:17290,crew:10860},
  {id:"boeing-767-200",name:"Boeing 767-200",maker:"Boeing",fam:"Boeing 767-200",cat:"wide",seats:216,range:11240,speed:880,fuelL100:2476,price:32280000,maint:16480,crew:10320},
  {id:"boeing-767-200er",name:"Boeing 767-200ER",maker:"Boeing",fam:"Boeing 767-200ER",cat:"wide",seats:216,range:11240,speed:880,fuelL100:2476,price:32280000,maint:16480,crew:10320},
  {id:"boeing-767-300",name:"Boeing 767-300",maker:"Boeing",fam:"Boeing 767-300",cat:"wide",seats:269,range:12035,speed:880,fuelL100:2731,price:36520000,maint:18070,crew:11380},
  {id:"boeing-767-300er",name:"Boeing 767-300ER",maker:"Boeing",fam:"Boeing 767-300ER",cat:"wide",seats:269,range:12035,speed:880,fuelL100:2731,price:36520000,maint:18070,crew:11380},
  {id:"boeing-767-400er",name:"Boeing 767-400ER",maker:"Boeing",fam:"Boeing 767-400ER",cat:"wide",seats:304,range:12560,speed:880,fuelL100:2899,price:39320000,maint:19120,crew:12080},
  {id:"boeing-777-200",name:"Boeing 777-200",maker:"Boeing",fam:"Boeing 777-200",cat:"wide",seats:305,range:12575,speed:880,fuelL100:2420,price:39400000,maint:19150,crew:12100},
  {id:"boeing-777-200er",name:"Boeing 777-200ER",maker:"Boeing",fam:"Boeing 777-200ER",cat:"wide",seats:305,range:12575,speed:880,fuelL100:2420,price:39400000,maint:19150,crew:12100},
  {id:"boeing-777-200lr",name:"Boeing 777-200LR",maker:"Boeing",fam:"Boeing 777-200LR",cat:"wide",seats:305,range:12575,speed:880,fuelL100:2420,price:39400000,maint:19150,crew:12100},
  {id:"boeing-777-300",name:"Boeing 777-300",maker:"Boeing",fam:"Boeing 777-300",cat:"wide",seats:368,range:13520,speed:880,fuelL100:2672,price:44440000,maint:21040,crew:13360},
  {id:"boeing-777-300er",name:"Boeing 777-300ER",maker:"Boeing",fam:"Boeing 777-300ER",cat:"wide",seats:396,range:13940,speed:880,fuelL100:2784,price:46680000,maint:21880,crew:13920},
  {id:"boeing-777f",name:"Boeing 777F",maker:"Boeing",fam:"Boeing 777F",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"boeing-777x-8",name:"Boeing 777X-8",maker:"Boeing",fam:"Boeing 777X-8",cat:"wide",seats:384,range:13760,speed:880,fuelL100:2736,price:45720000,maint:21520,crew:13680},
  {id:"boeing-777x-9",name:"Boeing 777X-9",maker:"Boeing",fam:"Boeing 777X-9",cat:"jumbo",seats:426,range:12130,speed:905,fuelL100:3439,price:47780000,maint:37780,crew:23520},
  {id:"boeing-787-3-annul",name:"Boeing 787-3 (annulé)",maker:"Boeing",fam:"Boeing 787-3",cat:"wide",seats:296,range:12440,speed:880,fuelL100:2384,price:38680000,maint:18880,crew:11920},
  {id:"boeing-787-8",name:"Boeing 787-8",maker:"Boeing",fam:"Boeing 787-8",cat:"wide",seats:242,range:11630,speed:880,fuelL100:2168,price:34360000,maint:17260,crew:10840},
  {id:"boeing-787-9",name:"Boeing 787-9",maker:"Boeing",fam:"Boeing 787-9",cat:"wide",seats:296,range:14140,speed:903,fuelL100:2200,price:29000000,maint:20000,crew:13500},
  {id:"boeing-787-10",name:"Boeing 787-10",maker:"Boeing",fam:"Boeing 787-10",cat:"wide",seats:330,range:12950,speed:880,fuelL100:2520,price:41400000,maint:19900,crew:12600},
  {id:"boeing-2707-sst",name:"Boeing 2707 SST",maker:"Boeing",fam:"Boeing 2707",cat:"supersonic",seats:300,range:9000,speed:2100,fuelL100:7500,price:150000000,maint:110000,crew:45000},
  {id:"boeing-sonic-cruiser",name:"Boeing Sonic Cruiser",maker:"Boeing",fam:"Boeing Sonic",cat:"wide",seats:250,range:11750,speed:880,fuelL100:2200,price:35000000,maint:17500,crew:11000},
  {id:"boeing-7j7-propfan",name:"Boeing 7J7 (propfan)",maker:"Boeing",fam:"Boeing 7J7",cat:"narrow",seats:150,range:6500,speed:840,fuelL100:750,price:12000000,maint:11000,crew:5500},
  {id:"nma-boeing-797-middle-of-market",name:"NMA / Boeing 797 (Middle of Market)",maker:"Boeing",fam:"NMA /",cat:"wide",seats:225,range:11375,speed:880,fuelL100:2100,price:33000000,maint:16750,crew:10500},
  {id:"boeing-x-48-bwb-concept",name:"Boeing X-48 (BWB concept)",maker:"Boeing",fam:"Boeing X-48",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"boeing-sugar-volt-concept",name:"Boeing SUGAR Volt (concept)",maker:"Boeing",fam:"Boeing SUGAR",cat:"narrow",seats:150,range:6500,speed:840,fuelL100:750,price:12000000,maint:11000,crew:5500},
  {id:"boeing-transonic-truss-braced-wing",name:"Boeing Transonic Truss-Braced Wing",maker:"Boeing",fam:"Boeing Transonic",cat:"narrow",seats:150,range:6500,speed:840,fuelL100:750,price:12000000,maint:11000,crew:5500},
  {id:"boeing-377-stratocruiser",name:"Boeing 377 Stratocruiser",maker:"Boeing",fam:"Boeing 377",cat:"regional",seats:100,range:4500,speed:840,fuelL100:600,price:25000000,maint:9000,crew:4000},
  {id:"douglas-dc-3",name:"Douglas DC-3",maker:"Douglas",fam:"Douglas DC-3",cat:"regional",seats:21,range:2130,speed:840,fuelL100:284,price:5250000,maint:4260,crew:2025},
  {id:"douglas-dc-4",name:"Douglas DC-4",maker:"Douglas",fam:"Douglas DC-4",cat:"regional",seats:44,range:2820,speed:840,fuelL100:376,price:11000000,maint:5640,crew:2600},
  {id:"douglas-dc-6",name:"Douglas DC-6",maker:"Douglas",fam:"Douglas DC-6",cat:"regional",seats:52,range:3060,speed:840,fuelL100:408,price:13000000,maint:6120,crew:2800},
  {id:"douglas-dc-6a-b",name:"Douglas DC-6A/B",maker:"Douglas",fam:"Douglas DC-6A/B",cat:"regional",seats:89,range:4170,speed:840,fuelL100:556,price:22250000,maint:8340,crew:3725},
  {id:"douglas-dc-7",name:"Douglas DC-7",maker:"Douglas",fam:"Douglas DC-7",cat:"regional",seats:99,range:4470,speed:840,fuelL100:596,price:24750000,maint:8940,crew:3975},
  {id:"douglas-dc-7b",name:"Douglas DC-7B",maker:"Douglas",fam:"Douglas DC-7B",cat:"regional",seats:105,range:4650,speed:840,fuelL100:620,price:26250000,maint:9300,crew:4125},
  {id:"douglas-dc-7c-seven-seas",name:"Douglas DC-7C Seven Seas",maker:"Douglas",fam:"Douglas DC-7C",cat:"regional",seats:105,range:4650,speed:840,fuelL100:620,price:26250000,maint:9300,crew:4125},
  {id:"douglas-dc-8-10",name:"Douglas DC-8-10",maker:"Douglas",fam:"Douglas DC-8-10",cat:"narrow",seats:177,range:7040,speed:840,fuelL100:1329,price:14160000,maint:12080,crew:6040},
  {id:"douglas-dc-8-20",name:"Douglas DC-8-20",maker:"Douglas",fam:"Douglas DC-8-20",cat:"narrow",seats:177,range:7040,speed:840,fuelL100:1329,price:14160000,maint:12080,crew:6040},
  {id:"douglas-dc-8-30",name:"Douglas DC-8-30",maker:"Douglas",fam:"Douglas DC-8-30",cat:"narrow",seats:177,range:7040,speed:840,fuelL100:1329,price:14160000,maint:12080,crew:6040},
  {id:"douglas-dc-8-40",name:"Douglas DC-8-40",maker:"Douglas",fam:"Douglas DC-8-40",cat:"narrow",seats:177,range:7040,speed:840,fuelL100:1329,price:14160000,maint:12080,crew:6040},
  {id:"douglas-dc-8-50",name:"Douglas DC-8-50",maker:"Douglas",fam:"Douglas DC-8-50",cat:"narrow",seats:189,range:7280,speed:840,fuelL100:1387,price:15120000,maint:12560,crew:6280},
  {id:"douglas-dc-8-61",name:"Douglas DC-8-61",maker:"Douglas",fam:"Douglas DC-8-61",cat:"wide",seats:259,range:11885,speed:880,fuelL100:3354,price:35720000,maint:17770,crew:11180},
  {id:"douglas-dc-8-62",name:"Douglas DC-8-62",maker:"Douglas",fam:"Douglas DC-8-62",cat:"narrow",seats:189,range:7280,speed:840,fuelL100:1387,price:15120000,maint:12560,crew:6280},
  {id:"douglas-dc-8-63",name:"Douglas DC-8-63",maker:"Douglas",fam:"Douglas DC-8-63",cat:"wide",seats:259,range:11885,speed:880,fuelL100:3354,price:35720000,maint:17770,crew:11180},
  {id:"douglas-dc-8-71-72-73",name:"Douglas DC-8-71/72/73",maker:"Douglas",fam:"Douglas DC-8-71/72/73",cat:"wide",seats:259,range:11885,speed:880,fuelL100:3354,price:35720000,maint:17770,crew:11180},
  {id:"douglas-dc-9-10",name:"Douglas DC-9-10",maker:"Douglas",fam:"Douglas DC-9-10",cat:"regional",seats:90,range:4200,speed:840,fuelL100:560,price:22500000,maint:8400,crew:3750},
  {id:"douglas-dc-9-20",name:"Douglas DC-9-20",maker:"Douglas",fam:"Douglas DC-9-20",cat:"regional",seats:90,range:4200,speed:840,fuelL100:560,price:22500000,maint:8400,crew:3750},
  {id:"douglas-dc-9-30",name:"Douglas DC-9-30",maker:"Douglas",fam:"Douglas DC-9-30",cat:"narrow",seats:115,range:5800,speed:840,fuelL100:645,price:9200000,maint:9600,crew:4800},
  {id:"douglas-dc-9-40",name:"Douglas DC-9-40",maker:"Douglas",fam:"Douglas DC-9-40",cat:"narrow",seats:125,range:6000,speed:840,fuelL100:675,price:10000000,maint:10000,crew:5000},
  {id:"douglas-dc-9-50",name:"Douglas DC-9-50",maker:"Douglas",fam:"Douglas DC-9-50",cat:"narrow",seats:139,range:6280,speed:840,fuelL100:717,price:11120000,maint:10560,crew:5280},
  {id:"douglas-dc-10-10",name:"Douglas DC-10-10",maker:"Douglas",fam:"Douglas DC-10-10",cat:"wide",seats:250,range:11750,speed:880,fuelL100:2200,price:35000000,maint:17500,crew:11000},
  {id:"douglas-dc-10-15",name:"Douglas DC-10-15",maker:"Douglas",fam:"Douglas DC-10-15",cat:"wide",seats:250,range:11750,speed:880,fuelL100:2200,price:35000000,maint:17500,crew:11000},
  {id:"douglas-dc-10-30",name:"Douglas DC-10-30",maker:"Douglas",fam:"Douglas DC-10-30",cat:"wide",seats:270,range:12050,speed:880,fuelL100:2280,price:36600000,maint:18100,crew:11400},
  {id:"douglas-dc-10-40",name:"Douglas DC-10-40",maker:"Douglas",fam:"Douglas DC-10-40",cat:"wide",seats:270,range:12050,speed:880,fuelL100:2280,price:36600000,maint:18100,crew:11400},
  {id:"md-11",name:"MD-11",maker:"McDonnell Douglas",fam:"MD-11",cat:"wide",seats:293,range:12395,speed:880,fuelL100:2372,price:38440000,maint:18790,crew:11860},
  {id:"md-11er",name:"MD-11ER",maker:"McDonnell Douglas",fam:"MD-11ER",cat:"wide",seats:293,range:12395,speed:880,fuelL100:2372,price:38440000,maint:18790,crew:11860},
  {id:"md-12-annul",name:"MD-12 (annulé)",maker:"McDonnell Douglas",fam:"MD-12 (annulé)",cat:"jumbo",seats:430,range:12150,speed:905,fuelL100:3445,price:47900000,maint:37900,crew:23600},
  {id:"md-80-md-81",name:"MD-80 (MD-81)",maker:"McDonnell Douglas",fam:"MD-80 (MD-81)",cat:"narrow",seats:155,range:6600,speed:840,fuelL100:765,price:12400000,maint:11200,crew:5600},
  {id:"md-82",name:"MD-82",maker:"McDonnell Douglas",fam:"MD-82",cat:"narrow",seats:155,range:6600,speed:840,fuelL100:765,price:12400000,maint:11200,crew:5600},
  {id:"md-83",name:"MD-83",maker:"McDonnell Douglas",fam:"MD-83",cat:"narrow",seats:155,range:6600,speed:840,fuelL100:765,price:12400000,maint:11200,crew:5600},
  {id:"md-87",name:"MD-87",maker:"McDonnell Douglas",fam:"MD-87",cat:"narrow",seats:130,range:6100,speed:840,fuelL100:690,price:10400000,maint:10200,crew:5100},
  {id:"md-88",name:"MD-88",maker:"McDonnell Douglas",fam:"MD-88",cat:"narrow",seats:142,range:6340,speed:840,fuelL100:726,price:11360000,maint:10680,crew:5340},
  {id:"md-90-30",name:"MD-90-30",maker:"McDonnell Douglas",fam:"MD-90-30",cat:"narrow",seats:153,range:6560,speed:840,fuelL100:759,price:12240000,maint:11120,crew:5560},
  {id:"md-90-50-annul",name:"MD-90-50 (annulé)",maker:"McDonnell Douglas",fam:"MD-90-50 (annulé)",cat:"narrow",seats:187,range:7240,speed:840,fuelL100:861,price:14960000,maint:12480,crew:6240},
  {id:"md-95-boeing-717",name:"MD-95 → Boeing 717",maker:"McDonnell Douglas",fam:"MD-95 →",cat:"narrow",seats:117,range:5840,speed:840,fuelL100:651,price:9360000,maint:9680,crew:4840},
  {id:"dc-11-concept",name:"DC-11 (concept)",maker:"Douglas",fam:"DC-11 (concept)",cat:"wide",seats:350,range:13250,speed:880,fuelL100:2600,price:43000000,maint:20500,crew:13000},
  {id:"lockheed-l-049-constellation",name:"Lockheed L-049 Constellation",maker:"Lockheed",fam:"Lockheed L-049",cat:"regional",seats:60,range:3300,speed:840,fuelL100:440,price:15000000,maint:6600,crew:3000},
  {id:"lockheed-l-649-constellation",name:"Lockheed L-649 Constellation",maker:"Lockheed",fam:"Lockheed L-649",cat:"regional",seats:81,range:3930,speed:840,fuelL100:524,price:20250000,maint:7860,crew:3525},
  {id:"lockheed-l-749-constellation",name:"Lockheed L-749 Constellation",maker:"Lockheed",fam:"Lockheed L-749",cat:"regional",seats:81,range:3930,speed:840,fuelL100:524,price:20250000,maint:7860,crew:3525},
  {id:"lockheed-l-1049-super-constellation",name:"Lockheed L-1049 Super Constellation",maker:"Lockheed",fam:"Lockheed L-1049",cat:"regional",seats:95,range:4350,speed:840,fuelL100:580,price:23750000,maint:8700,crew:3875},
  {id:"lockheed-l-1049g-super-connie",name:"Lockheed L-1049G Super Connie",maker:"Lockheed",fam:"Lockheed L-1049G",cat:"regional",seats:95,range:4350,speed:840,fuelL100:580,price:23750000,maint:8700,crew:3875},
  {id:"lockheed-l-1649a-starliner",name:"Lockheed L-1649A Starliner",maker:"Lockheed",fam:"Lockheed L-1649A",cat:"regional",seats:99,range:4470,speed:840,fuelL100:596,price:24750000,maint:8940,crew:3975},
  {id:"lockheed-l-188-electra",name:"Lockheed L-188 Electra",maker:"Lockheed",fam:"Lockheed L-188",cat:"regional",seats:98,range:4440,speed:840,fuelL100:592,price:24500000,maint:8880,crew:3950},
  {id:"lockheed-l-1011-1-tristar",name:"Lockheed L-1011-1 TriStar",maker:"Lockheed",fam:"Lockheed L-1011-1",cat:"jumbo",seats:400,range:12000,speed:905,fuelL100:3400,price:47000000,maint:37000,crew:23000},
  {id:"lockheed-l-1011-100",name:"Lockheed L-1011-100",maker:"Lockheed",fam:"Lockheed L-1011-100",cat:"jumbo",seats:400,range:12000,speed:905,fuelL100:3400,price:47000000,maint:37000,crew:23000},
  {id:"lockheed-l-1011-200",name:"Lockheed L-1011-200",maker:"Lockheed",fam:"Lockheed L-1011-200",cat:"jumbo",seats:400,range:12000,speed:905,fuelL100:3400,price:47000000,maint:37000,crew:23000},
  {id:"lockheed-l-1011-500",name:"Lockheed L-1011-500",maker:"Lockheed",fam:"Lockheed L-1011-500",cat:"wide",seats:330,range:12950,speed:880,fuelL100:2520,price:41400000,maint:19900,crew:12600},
  {id:"lockheed-l-2000-sst-annul",name:"Lockheed L-2000 SST (annulé)",maker:"Lockheed",fam:"Lockheed L-2000",cat:"wide",seats:221,range:11315,speed:880,fuelL100:2084,price:32680000,maint:16630,crew:10420},
  {id:"lockheed-cl-1201-tude-hale",name:"Lockheed CL-1201 (étude HALE)",maker:"Lockheed",fam:"Lockheed CL-1201",cat:"jumbo",seats:1000,range:15000,speed:905,fuelL100:4300,price:65000000,maint:55000,crew:35000},
  {id:"convair-cv-240",name:"Convair CV-240",maker:"Convair",fam:"Convair CV-240",cat:"regional",seats:40,range:2700,speed:840,fuelL100:360,price:10000000,maint:5400,crew:2500},
  {id:"convair-cv-340",name:"Convair CV-340",maker:"Convair",fam:"Convair CV-340",cat:"regional",seats:44,range:2820,speed:840,fuelL100:376,price:11000000,maint:5640,crew:2600},
  {id:"convair-cv-440-metropolitan",name:"Convair CV-440 Metropolitan",maker:"Convair",fam:"Convair CV-440",cat:"regional",seats:52,range:3060,speed:840,fuelL100:408,price:13000000,maint:6120,crew:2800},
  {id:"convair-cv-540-turboprop",name:"Convair CV-540 (turboprop)",maker:"Convair",fam:"Convair CV-540",cat:"turboprop",seats:52,range:1580,speed:485,fuelL100:236,price:4680000,maint:3580,crew:1580},
  {id:"convair-cv-580-turboprop",name:"Convair CV-580 (turboprop)",maker:"Convair",fam:"Convair CV-580",cat:"turboprop",seats:52,range:1580,speed:485,fuelL100:236,price:4680000,maint:3580,crew:1580},
  {id:"convair-cv-600-turbofan",name:"Convair CV-600 (turbofan)",maker:"Convair",fam:"Convair CV-600",cat:"regional",seats:52,range:3060,speed:840,fuelL100:408,price:13000000,maint:6120,crew:2800},
  {id:"convair-cv-640-turboprop",name:"Convair CV-640 (turboprop)",maker:"Convair",fam:"Convair CV-640",cat:"turboprop",seats:52,range:1580,speed:485,fuelL100:236,price:4680000,maint:3580,crew:1580},
  {id:"convair-cv-880",name:"Convair CV-880",maker:"Convair",fam:"Convair CV-880",cat:"narrow",seats:110,range:5700,speed:840,fuelL100:630,price:8800000,maint:9400,crew:4700},
  {id:"convair-cv-990-coronado",name:"Convair CV-990 Coronado",maker:"Convair",fam:"Convair CV-990",cat:"narrow",seats:121,range:5920,speed:840,fuelL100:663,price:9680000,maint:9840,crew:4920},
  {id:"convair-cv-600-skylark-concept",name:"Convair CV-600 Skylark (concept)",maker:"Convair",fam:"Convair CV-600",cat:"narrow",seats:200,range:7500,speed:840,fuelL100:900,price:16000000,maint:13000,crew:6500},
  {id:"de-havilland-comet-1",name:"de Havilland Comet 1",maker:"de Havilland",fam:"de Havilland",cat:"regional",seats:36,range:2580,speed:840,fuelL100:344,price:9000000,maint:5160,crew:2400},
  {id:"de-havilland-comet-2",name:"de Havilland Comet 2",maker:"de Havilland",fam:"de Havilland",cat:"regional",seats:44,range:2820,speed:840,fuelL100:376,price:11000000,maint:5640,crew:2600},
  {id:"de-havilland-comet-3-proto",name:"de Havilland Comet 3 (proto)",maker:"de Havilland",fam:"de Havilland",cat:"regional",seats:58,range:3240,speed:840,fuelL100:432,price:14500000,maint:6480,crew:2950},
  {id:"de-havilland-comet-4",name:"de Havilland Comet 4",maker:"de Havilland",fam:"de Havilland",cat:"regional",seats:74,range:3720,speed:840,fuelL100:496,price:18500000,maint:7440,crew:3350},
  {id:"de-havilland-comet-4b-4c",name:"de Havilland Comet 4B/4C",maker:"de Havilland",fam:"de Havilland",cat:"regional",seats:99,range:4470,speed:840,fuelL100:596,price:24750000,maint:8940,crew:3975},
  {id:"vickers-viking",name:"Vickers Viking",maker:"Vickers",fam:"Vickers Viking",cat:"regional",seats:27,range:2310,speed:840,fuelL100:308,price:6750000,maint:4620,crew:2175},
  {id:"vickers-viscount-700",name:"Vickers Viscount 700",maker:"Vickers",fam:"Vickers Viscount",cat:"regional",seats:47,range:2910,speed:840,fuelL100:388,price:11750000,maint:5820,crew:2675},
  {id:"vickers-viscount-800",name:"Vickers Viscount 800",maker:"Vickers",fam:"Vickers Viscount",cat:"regional",seats:65,range:3450,speed:840,fuelL100:460,price:16250000,maint:6900,crew:3125},
  {id:"vickers-vanguard",name:"Vickers Vanguard",maker:"Vickers",fam:"Vickers Vanguard",cat:"narrow",seats:139,range:6280,speed:840,fuelL100:717,price:11120000,maint:10560,crew:5280},
  {id:"vickers-vc-10",name:"Vickers VC-10",maker:"Vickers",fam:"Vickers VC-10",cat:"narrow",seats:151,range:6520,speed:840,fuelL100:753,price:12080000,maint:11040,crew:5520},
  {id:"super-vc-10",name:"Super VC-10",maker:"BAC",fam:"Super VC-10",cat:"narrow",seats:163,range:6760,speed:840,fuelL100:789,price:13040000,maint:11520,crew:5760},
  {id:"bac-one-eleven-200",name:"BAC One-Eleven 200",maker:"BAC",fam:"BAC One-Eleven",cat:"regional",seats:79,range:3870,speed:840,fuelL100:516,price:19750000,maint:7740,crew:3475},
  {id:"bac-one-eleven-300",name:"BAC One-Eleven 300",maker:"BAC",fam:"BAC One-Eleven",cat:"regional",seats:89,range:4170,speed:840,fuelL100:556,price:22250000,maint:8340,crew:3725},
  {id:"bac-one-eleven-400",name:"BAC One-Eleven 400",maker:"BAC",fam:"BAC One-Eleven",cat:"regional",seats:89,range:4170,speed:840,fuelL100:556,price:22250000,maint:8340,crew:3725},
  {id:"bac-one-eleven-475",name:"BAC One-Eleven 475",maker:"BAC",fam:"BAC One-Eleven",cat:"regional",seats:89,range:4170,speed:840,fuelL100:556,price:22250000,maint:8340,crew:3725},
  {id:"bac-one-eleven-500",name:"BAC One-Eleven 500",maker:"BAC",fam:"BAC One-Eleven",cat:"narrow",seats:119,range:5880,speed:840,fuelL100:657,price:9520000,maint:9760,crew:4880},
  {id:"bac-one-eleven-475x-annul",name:"BAC One-Eleven 475X (annulé)",maker:"BAC",fam:"BAC One-Eleven",cat:"narrow",seats:130,range:6100,speed:840,fuelL100:690,price:10400000,maint:10200,crew:5100},
  {id:"hawker-siddeley-trident-1",name:"Hawker Siddeley Trident 1",maker:"Hawker Siddeley",fam:"Hawker Siddeley",cat:"regional",seats:103,range:4590,speed:840,fuelL100:612,price:25750000,maint:9180,crew:4075},
  {id:"hawker-siddeley-trident-2e",name:"Hawker Siddeley Trident 2E",maker:"Hawker Siddeley",fam:"Hawker Siddeley",cat:"narrow",seats:139,range:6280,speed:840,fuelL100:1147,price:11120000,maint:10560,crew:5280},
  {id:"hawker-siddeley-trident-3b",name:"Hawker Siddeley Trident 3B",maker:"Hawker Siddeley",fam:"Hawker Siddeley",cat:"narrow",seats:180,range:7100,speed:840,fuelL100:1344,price:14400000,maint:12200,crew:6100},
  {id:"bac-a-rospatiale-concorde",name:"BAC/Aérospatiale Concorde",maker:"BAC",fam:"BAC/Aérospatiale Concorde",cat:"supersonic",seats:100,range:7000,speed:2100,fuelL100:2500,price:150000000,maint:70000,crew:25000},
  {id:"bae-146-100",name:"BAe 146-100",maker:"BAE Systems",fam:"BAe 146-100",cat:"regional",seats:82,range:3960,speed:840,fuelL100:528,price:20500000,maint:7920,crew:3550},
  {id:"bae-146-200",name:"BAe 146-200",maker:"BAE Systems",fam:"BAe 146-200",cat:"regional",seats:100,range:4500,speed:840,fuelL100:600,price:25000000,maint:9000,crew:4000},
  {id:"bae-146-300",name:"BAe 146-300",maker:"BAE Systems",fam:"BAe 146-300",cat:"narrow",seats:128,range:6060,speed:840,fuelL100:684,price:10240000,maint:10120,crew:5060},
  {id:"avro-rj70",name:"Avro RJ70",maker:"BAE Systems",fam:"Avro RJ70",cat:"regional",seats:70,range:3600,speed:840,fuelL100:480,price:17500000,maint:7200,crew:3250},
  {id:"avro-rj85",name:"Avro RJ85",maker:"BAE Systems",fam:"Avro RJ85",cat:"regional",seats:85,range:4050,speed:840,fuelL100:540,price:21250000,maint:8100,crew:3625},
  {id:"avro-rj100",name:"Avro RJ100",maker:"BAE Systems",fam:"Avro RJ100",cat:"narrow",seats:112,range:5740,speed:840,fuelL100:636,price:8960000,maint:9480,crew:4740},
  {id:"avro-rjx-annul",name:"Avro RJX (annulé)",maker:"BAE Systems",fam:"Avro RJX",cat:"regional",seats:100,range:4500,speed:840,fuelL100:600,price:25000000,maint:9000,crew:4000},
  {id:"bae-atp",name:"BAe ATP",maker:"BAE Systems",fam:"BAe ATP",cat:"regional",seats:72,range:3660,speed:840,fuelL100:488,price:18000000,maint:7320,crew:3300},
  {id:"bae-jetstream-41",name:"BAe Jetstream 41",maker:"BAE Systems",fam:"BAe Jetstream",cat:"regional",seats:29,range:2370,speed:840,fuelL100:316,price:7250000,maint:4740,crew:2225},
  {id:"handley-page-herald",name:"Handley Page Herald",maker:"Handley Page",fam:"Handley Page",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"fokker-f-vii-3m",name:"Fokker F.VII/3m",maker:"Fokker",fam:"Fokker F.VII/3m",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"fokker-f-xviii-pelican",name:"Fokker F.XVIII (Pelican)",maker:"Fokker",fam:"Fokker F.XVIII",cat:"regional",seats:16,range:1980,speed:840,fuelL100:264,price:5000000,maint:3960,crew:1900},
  {id:"fokker-f-xxii",name:"Fokker F.XXII",maker:"Fokker",fam:"Fokker F.XXII",cat:"regional",seats:22,range:2160,speed:840,fuelL100:288,price:5500000,maint:4320,crew:2050},
  {id:"fokker-f-xxxvi",name:"Fokker F.XXXVI",maker:"Fokker",fam:"Fokker F.XXXVI",cat:"regional",seats:32,range:2460,speed:840,fuelL100:328,price:8000000,maint:4920,crew:2300},
  {id:"fokker-f27-friendship-mk100",name:"Fokker F27 Friendship Mk100",maker:"Fokker",fam:"Fokker F27",cat:"regional",seats:28,range:2340,speed:840,fuelL100:312,price:7000000,maint:4680,crew:2200},
  {id:"fokker-f27-mk200-300-400-500",name:"Fokker F27 Mk200/300/400/500",maker:"Fokker",fam:"Fokker F27",cat:"regional",seats:52,range:3060,speed:840,fuelL100:408,price:13000000,maint:6120,crew:2800},
  {id:"fokker-f28-fellowship-mk1000",name:"Fokker F28 Fellowship Mk1000",maker:"Fokker",fam:"Fokker F28",cat:"regional",seats:65,range:3450,speed:840,fuelL100:460,price:16250000,maint:6900,crew:3125},
  {id:"fokker-f28-mk2000-3000-4000",name:"Fokker F28 Mk2000/3000/4000",maker:"Fokker",fam:"Fokker F28",cat:"regional",seats:85,range:4050,speed:840,fuelL100:540,price:21250000,maint:8100,crew:3625},
  {id:"fokker-50",name:"Fokker 50",maker:"Fokker",fam:"Fokker 50",cat:"turboprop",seats:50,range:1550,speed:485,fuelL100:230,price:4500000,maint:3500,crew:1550},
  {id:"fokker-60-militaire-civil",name:"Fokker 60 (militaire/civil)",maker:"Fokker",fam:"Fokker 60",cat:"regional",seats:58,range:3240,speed:840,fuelL100:432,price:14500000,maint:6480,crew:2950},
  {id:"fokker-70",name:"Fokker 70",maker:"Fokker",fam:"Fokker 70",cat:"regional",seats:80,range:3900,speed:840,fuelL100:520,price:20000000,maint:7800,crew:3500},
  {id:"fokker-100",name:"Fokker 100",maker:"Fokker",fam:"Fokker 100",cat:"regional",seats:107,range:4710,speed:840,fuelL100:628,price:26750000,maint:9420,crew:4175},
  {id:"fokker-f130-projet",name:"Fokker F130 (projet)",maker:"Fokker",fam:"Fokker F130",cat:"narrow",seats:130,range:6100,speed:840,fuelL100:690,price:10400000,maint:10200,crew:5100},
  {id:"emb-110-bandeirante",name:"EMB 110 Bandeirante",maker:"Embraer",fam:"EMB 110",cat:"turboprop",seats:18,range:1070,speed:465,fuelL100:134,price:2000000,maint:2220,crew:1070},
  {id:"emb-120-brasilia",name:"EMB 120 Brasilia",maker:"Embraer",fam:"EMB 120",cat:"turboprop",seats:30,range:1250,speed:475,fuelL100:170,price:2700000,maint:2700,crew:1250},
  {id:"erj-135",name:"ERJ 135",maker:"Embraer",fam:"ERJ 135",cat:"regional",seats:37,range:2610,speed:840,fuelL100:348,price:9250000,maint:5220,crew:2425},
  {id:"erj-140",name:"ERJ 140",maker:"Embraer",fam:"ERJ 140",cat:"regional",seats:44,range:2820,speed:840,fuelL100:376,price:11000000,maint:5640,crew:2600},
  {id:"erj-145",name:"ERJ 145",maker:"Embraer",fam:"ERJ 145",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"erj-145-xr",name:"ERJ 145 XR",maker:"Embraer",fam:"ERJ 145",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"e170",name:"E170",maker:"Embraer",fam:"E170",cat:"regional",seats:70,range:3600,speed:840,fuelL100:480,price:17500000,maint:7200,crew:3250},
  {id:"e175",name:"E175",maker:"Embraer",fam:"E175",cat:"regional",seats:80,range:3900,speed:840,fuelL100:520,price:20000000,maint:7800,crew:3500},
  {id:"e190",name:"E190",maker:"Embraer",fam:"E190",cat:"regional",seats:98,range:4440,speed:840,fuelL100:592,price:24500000,maint:8880,crew:3950},
  {id:"e195",name:"E195",maker:"Embraer",fam:"E195",cat:"narrow",seats:122,range:5940,speed:840,fuelL100:666,price:9760000,maint:9880,crew:4940},
  {id:"e175-e2",name:"E175-E2",maker:"Embraer",fam:"E175-E2",cat:"regional",seats:80,range:3900,speed:840,fuelL100:520,price:20000000,maint:7800,crew:3500},
  {id:"e190-e2",name:"E190-E2",maker:"Embraer",fam:"E190-E2",cat:"regional",seats:106,range:4680,speed:840,fuelL100:624,price:26500000,maint:9360,crew:4150},
  {id:"e195-e2",name:"E195-E2",maker:"Embraer",fam:"E195-E2",cat:"narrow",seats:146,range:6420,speed:840,fuelL100:738,price:11680000,maint:10840,crew:5420},
  {id:"embraer-energia-turboprop-concept",name:"Embraer Energia (turboprop concept)",maker:"Embraer",fam:"Embraer Energia",cat:"turboprop",seats:30,range:1250,speed:475,fuelL100:170,price:2700000,maint:2700,crew:1250},
  {id:"embraer-energia-regional-jet-concep",name:"Embraer Energia (regional jet concept)",maker:"Embraer",fam:"Embraer Energia",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"lineage-1000-bizjet-grand",name:"Lineage 1000 (bizjet grand)",maker:"Embraer",fam:"Lineage 1000",cat:"regional",seats:19,range:2070,speed:840,fuelL100:276,price:5000000,maint:4140,crew:1975},
  {id:"emb-314-super-tucano-parachutage",name:"EMB 314 Super Tucano (parachutage)",maker:"Embraer",fam:"EMB 314",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"crj100",name:"CRJ100",maker:"Bombardier",fam:"CRJ100",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"crj200",name:"CRJ200",maker:"Bombardier",fam:"CRJ200",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"crj700",name:"CRJ700",maker:"Bombardier",fam:"CRJ700",cat:"regional",seats:70,range:3600,speed:840,fuelL100:480,price:17500000,maint:7200,crew:3250},
  {id:"crj705",name:"CRJ705",maker:"Bombardier",fam:"CRJ705",cat:"regional",seats:75,range:3750,speed:840,fuelL100:500,price:18750000,maint:7500,crew:3375},
  {id:"crj900",name:"CRJ900",maker:"Bombardier",fam:"CRJ900",cat:"regional",seats:90,range:4200,speed:840,fuelL100:560,price:22500000,maint:8400,crew:3750},
  {id:"crj1000",name:"CRJ1000",maker:"Bombardier",fam:"CRJ1000",cat:"regional",seats:100,range:4500,speed:840,fuelL100:600,price:25000000,maint:9000,crew:4000},
  {id:"dash-8-q100-dhc-8-100",name:"Dash 8 Q100 (DHC-8-100)",maker:"Bombardier",fam:"Dash 8",cat:"regional",seats:37,range:2610,speed:840,fuelL100:348,price:9250000,maint:5220,crew:2425},
  {id:"dash-8-q200-dhc-8-200",name:"Dash 8 Q200 (DHC-8-200)",maker:"Bombardier",fam:"Dash 8",cat:"regional",seats:37,range:2610,speed:840,fuelL100:348,price:9250000,maint:5220,crew:2425},
  {id:"dash-8-q300-dhc-8-300",name:"Dash 8 Q300 (DHC-8-300)",maker:"Bombardier",fam:"Dash 8",cat:"regional",seats:56,range:3180,speed:840,fuelL100:424,price:14000000,maint:6360,crew:2900},
  {id:"dash-8-q400-dhc-8-400",name:"Dash 8 Q400 (DHC-8-400)",maker:"Bombardier",fam:"Dash 8",cat:"regional",seats:78,range:3840,speed:840,fuelL100:512,price:19500000,maint:7680,crew:3450},
  {id:"cs100-a220-100",name:"CS100 → A220-100",maker:"Bombardier",fam:"CS100 →",cat:"regional",seats:108,range:4740,speed:840,fuelL100:632,price:27000000,maint:9480,crew:4200},
  {id:"cs300-a220-300",name:"CS300 → A220-300",maker:"Bombardier",fam:"CS300 →",cat:"narrow",seats:130,range:6100,speed:840,fuelL100:690,price:10400000,maint:10200,crew:5100},
  {id:"cs500-annul",name:"CS500 (annulé)",maker:"Bombardier",fam:"CS500 (annulé)",cat:"narrow",seats:160,range:6700,speed:840,fuelL100:780,price:12800000,maint:11400,crew:5700},
  {id:"global-7500",name:"Global 7500",maker:"Bombardier",fam:"Global 7500",cat:"regional",seats:19,range:2070,speed:840,fuelL100:276,price:5000000,maint:4140,crew:1975},
  {id:"global-8000",name:"Global 8000",maker:"Bombardier",fam:"Global 8000",cat:"regional",seats:19,range:2070,speed:840,fuelL100:276,price:5000000,maint:4140,crew:1975},
  {id:"global-6500",name:"Global 6500",maker:"Bombardier",fam:"Global 6500",cat:"regional",seats:17,range:2010,speed:840,fuelL100:268,price:5000000,maint:4020,crew:1925},
  {id:"global-6000",name:"Global 6000",maker:"Bombardier",fam:"Global 6000",cat:"regional",seats:17,range:2010,speed:840,fuelL100:268,price:5000000,maint:4020,crew:1925},
  {id:"global-5500",name:"Global 5500",maker:"Bombardier",fam:"Global 5500",cat:"regional",seats:16,range:1980,speed:840,fuelL100:264,price:5000000,maint:3960,crew:1900},
  {id:"challenger-650",name:"Challenger 650",maker:"Bombardier",fam:"Challenger 650",cat:"regional",seats:12,range:1860,speed:840,fuelL100:248,price:5000000,maint:3720,crew:1800},
  {id:"challenger-605",name:"Challenger 605",maker:"Bombardier",fam:"Challenger 605",cat:"regional",seats:12,range:1860,speed:840,fuelL100:248,price:5000000,maint:3720,crew:1800},
  {id:"challenger-600",name:"Challenger 600",maker:"Bombardier",fam:"Challenger 600",cat:"regional",seats:19,range:2070,speed:840,fuelL100:276,price:5000000,maint:4140,crew:1975},
  {id:"challenger-300",name:"Challenger 300",maker:"Bombardier",fam:"Challenger 300",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"challenger-350",name:"Challenger 350",maker:"Bombardier",fam:"Challenger 350",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"learjet-85-annul",name:"Learjet 85 (annulé)",maker:"Bombardier",fam:"Learjet 85",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"atr-42-200",name:"ATR 42-200",maker:"ATR",fam:"ATR 42-200",cat:"turboprop",seats:42,range:1430,speed:480,fuelL100:206,price:3780000,maint:3180,crew:1430},
  {id:"atr-42-300",name:"ATR 42-300",maker:"ATR",fam:"ATR 42-300",cat:"turboprop",seats:48,range:1520,speed:480,fuelL100:224,price:4320000,maint:3420,crew:1520},
  {id:"atr-42-500",name:"ATR 42-500",maker:"ATR",fam:"ATR 42-500",cat:"turboprop",seats:48,range:1520,speed:480,fuelL100:224,price:4320000,maint:3420,crew:1520},
  {id:"atr-42-600",name:"ATR 42-600",maker:"ATR",fam:"ATR 42-600",cat:"turboprop",seats:50,range:1600,speed:510,fuelL100:195,price:6200000,maint:3600,crew:1300},
  {id:"atr-42-600s",name:"ATR 42-600S",maker:"ATR",fam:"ATR 42-600S",cat:"turboprop",seats:50,range:1550,speed:485,fuelL100:230,price:4500000,maint:3500,crew:1550},
  {id:"atr-72-200",name:"ATR 72-200",maker:"ATR",fam:"ATR 72-200",cat:"turboprop",seats:70,range:1850,speed:495,fuelL100:290,price:6300000,maint:4300,crew:1850},
  {id:"atr-72-210",name:"ATR 72-210",maker:"ATR",fam:"ATR 72-210",cat:"turboprop",seats:72,range:1880,speed:495,fuelL100:296,price:6480000,maint:4380,crew:1880},
  {id:"atr-72-500",name:"ATR 72-500",maker:"ATR",fam:"ATR 72-500",cat:"turboprop",seats:72,range:1880,speed:495,fuelL100:296,price:6480000,maint:4380,crew:1880},
  {id:"atr-72-600",name:"ATR 72-600",maker:"ATR",fam:"ATR 72-600",cat:"turboprop",seats:78,range:1528,speed:510,fuelL100:240,price:9000000,maint:4800,crew:1800},
  {id:"atr-100-projet",name:"ATR 100 (projet)",maker:"ATR",fam:"ATR 100",cat:"turboprop",seats:100,range:2300,speed:510,fuelL100:380,price:9000000,maint:5500,crew:2300},
  {id:"atr-evo-concept-hybride",name:"ATR EVO (concept hybride)",maker:"ATR",fam:"ATR EVO",cat:"turboprop",seats:72,range:1880,speed:495,fuelL100:296,price:6480000,maint:4380,crew:1880},
  {id:"saab-340a",name:"Saab 340A",maker:"Saab",fam:"Saab 340A",cat:"turboprop",seats:35,range:1325,speed:475,fuelL100:185,price:3150000,maint:2900,crew:1325},
  {id:"saab-340b",name:"Saab 340B",maker:"Saab",fam:"Saab 340B",cat:"turboprop",seats:36,range:1340,speed:475,fuelL100:188,price:3240000,maint:2940,crew:1340},
  {id:"saab-340b-plus",name:"Saab 340B Plus",maker:"Saab",fam:"Saab 340B",cat:"turboprop",seats:36,range:1340,speed:475,fuelL100:188,price:3240000,maint:2940,crew:1340},
  {id:"saab-2000",name:"Saab 2000",maker:"Saab",fam:"Saab 2000",cat:"turboprop",seats:50,range:1550,speed:485,fuelL100:230,price:4500000,maint:3500,crew:1550},
  {id:"dornier-do-x-hydravion",name:"Dornier Do X (hydravion)",maker:"Dornier",fam:"Dornier Do",cat:"regional",seats:66,range:3480,speed:840,fuelL100:464,price:16500000,maint:6960,crew:3150},
  {id:"dornier-do-17",name:"Dornier Do 17",maker:"Dornier",fam:"Dornier Do",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"dornier-do-24-hydravion",name:"Dornier Do 24 (hydravion)",maker:"Dornier",fam:"Dornier Do",cat:"regional",seats:12,range:1860,speed:840,fuelL100:248,price:5000000,maint:3720,crew:1800},
  {id:"dornier-do-24-att-modernis",name:"Dornier Do 24 ATT (modernisé)",maker:"Dornier",fam:"Dornier Do",cat:"regional",seats:12,range:1860,speed:840,fuelL100:248,price:5000000,maint:3720,crew:1800},
  {id:"dornier-228-100",name:"Dornier 228-100",maker:"Dornier",fam:"Dornier 228-100",cat:"regional",seats:19,range:2070,speed:840,fuelL100:276,price:5000000,maint:4140,crew:1975},
  {id:"dornier-228-200",name:"Dornier 228-200",maker:"Dornier",fam:"Dornier 228-200",cat:"regional",seats:19,range:2070,speed:840,fuelL100:276,price:5000000,maint:4140,crew:1975},
  {id:"dornier-328-100",name:"Dornier 328-100",maker:"Dornier",fam:"Dornier 328-100",cat:"regional",seats:32,range:2460,speed:840,fuelL100:328,price:8000000,maint:4920,crew:2300},
  {id:"dornier-328jet",name:"Dornier 328JET",maker:"Dornier",fam:"Dornier 328JET",cat:"regional",seats:32,range:2460,speed:840,fuelL100:328,price:8000000,maint:4920,crew:2300},
  {id:"dornier-728-annul",name:"Dornier 728 (annulé)",maker:"Fairchild Dornier",fam:"Dornier 728",cat:"regional",seats:70,range:3600,speed:840,fuelL100:480,price:17500000,maint:7200,crew:3250},
  {id:"dornier-928-annul",name:"Dornier 928 (annulé)",maker:"Fairchild Dornier",fam:"Dornier 928",cat:"regional",seats:90,range:4200,speed:840,fuelL100:560,price:22500000,maint:8400,crew:3750},
  {id:"dornier-seastar-cd2",name:"Dornier Seastar CD2",maker:"Dornier Seaplane",fam:"Dornier Seastar",cat:"regional",seats:12,range:1860,speed:840,fuelL100:248,price:5000000,maint:3720,crew:1800},
  {id:"tupolev-tu-104a",name:"Tupolev Tu-104A",maker:"Tupolev",fam:"Tupolev Tu-104A",cat:"regional",seats:70,range:3600,speed:840,fuelL100:480,price:17500000,maint:7200,crew:3250},
  {id:"tupolev-tu-104b",name:"Tupolev Tu-104B",maker:"Tupolev",fam:"Tupolev Tu-104B",cat:"regional",seats:100,range:4500,speed:840,fuelL100:600,price:25000000,maint:9000,crew:4000},
  {id:"tupolev-tu-110-proto",name:"Tupolev Tu-110 (proto)",maker:"Tupolev",fam:"Tupolev Tu-110",cat:"regional",seats:100,range:4500,speed:840,fuelL100:600,price:25000000,maint:9000,crew:4000},
  {id:"tupolev-tu-114",name:"Tupolev Tu-114",maker:"Tupolev",fam:"Tupolev Tu-114",cat:"narrow",seats:170,range:6900,speed:840,fuelL100:810,price:13600000,maint:11800,crew:5900},
  {id:"tupolev-tu-124",name:"Tupolev Tu-124",maker:"Tupolev",fam:"Tupolev Tu-124",cat:"regional",seats:56,range:3180,speed:840,fuelL100:424,price:14000000,maint:6360,crew:2900},
  {id:"tupolev-tu-134a",name:"Tupolev Tu-134A",maker:"Tupolev",fam:"Tupolev Tu-134A",cat:"regional",seats:76,range:3780,speed:840,fuelL100:504,price:19000000,maint:7560,crew:3400},
  {id:"tupolev-tu-134b",name:"Tupolev Tu-134B",maker:"Tupolev",fam:"Tupolev Tu-134B",cat:"regional",seats:80,range:3900,speed:840,fuelL100:520,price:20000000,maint:7800,crew:3500},
  {id:"tupolev-tu-144",name:"Tupolev Tu-144",maker:"Tupolev",fam:"Tupolev Tu-144",cat:"supersonic",seats:150,range:7500,speed:2100,fuelL100:3750,price:150000000,maint:80000,crew:30000},
  {id:"tupolev-tu-144ll-modernis",name:"Tupolev Tu-144LL (modernisé)",maker:"Tupolev",fam:"Tupolev Tu-144LL",cat:"supersonic",seats:50,range:6500,speed:2100,fuelL100:1250,price:150000000,maint:60000,crew:20000},
  {id:"tupolev-tu-154a",name:"Tupolev Tu-154A",maker:"Tupolev",fam:"Tupolev Tu-154A",cat:"narrow",seats:128,range:6060,speed:840,fuelL100:684,price:10240000,maint:10120,crew:5060},
  {id:"tupolev-tu-154b-b-2",name:"Tupolev Tu-154B/B-2",maker:"Tupolev",fam:"Tupolev Tu-154B/B-2",cat:"narrow",seats:180,range:7100,speed:840,fuelL100:840,price:14400000,maint:12200,crew:6100},
  {id:"tupolev-tu-154m",name:"Tupolev Tu-154M",maker:"Tupolev",fam:"Tupolev Tu-154M",cat:"narrow",seats:180,range:7100,speed:840,fuelL100:840,price:14400000,maint:12200,crew:6100},
  {id:"tupolev-tu-155-lng-prototype",name:"Tupolev Tu-155 (LNG prototype)",maker:"Tupolev",fam:"Tupolev Tu-155",cat:"narrow",seats:155,range:6600,speed:840,fuelL100:765,price:12400000,maint:11200,crew:5600},
  {id:"tupolev-tu-156-lng",name:"Tupolev Tu-156 (LNG)",maker:"Tupolev",fam:"Tupolev Tu-156",cat:"narrow",seats:164,range:6780,speed:840,fuelL100:792,price:13120000,maint:11560,crew:5780},
  {id:"tupolev-tu-204-100",name:"Tupolev Tu-204-100",maker:"Tupolev",fam:"Tupolev Tu-204-100",cat:"wide",seats:210,range:11150,speed:880,fuelL100:2448,price:31800000,maint:16300,crew:10200},
  {id:"tupolev-tu-204-120",name:"Tupolev Tu-204-120",maker:"Tupolev",fam:"Tupolev Tu-204-120",cat:"wide",seats:210,range:11150,speed:880,fuelL100:2448,price:31800000,maint:16300,crew:10200},
  {id:"tupolev-tu-204-200-tu-214",name:"Tupolev Tu-204-200 (Tu-214)",maker:"Tupolev",fam:"Tupolev Tu-204-200",cat:"wide",seats:210,range:11150,speed:880,fuelL100:2448,price:31800000,maint:16300,crew:10200},
  {id:"tupolev-tu-204sm",name:"Tupolev Tu-204SM",maker:"Tupolev",fam:"Tupolev Tu-204SM",cat:"wide",seats:215,range:11225,speed:880,fuelL100:2472,price:32200000,maint:16450,crew:10300},
  {id:"tupolev-tu-234-concept",name:"Tupolev Tu-234 (concept)",maker:"Tupolev",fam:"Tupolev Tu-234",cat:"wide",seats:230,range:11450,speed:880,fuelL100:2120,price:33400000,maint:16900,crew:10600},
  {id:"tupolev-tu-304-sst-concept",name:"Tupolev Tu-304 (SST concept)",maker:"Tupolev",fam:"Tupolev Tu-304",cat:"wide",seats:300,range:12500,speed:880,fuelL100:2400,price:39000000,maint:19000,crew:12000},
  {id:"tupolev-tu-324-r-gional",name:"Tupolev Tu-324 (régional)",maker:"Tupolev",fam:"Tupolev Tu-324",cat:"regional",seats:52,range:3060,speed:840,fuelL100:408,price:13000000,maint:6120,crew:2800},
  {id:"tupolev-tu-334",name:"Tupolev Tu-334",maker:"Tupolev",fam:"Tupolev Tu-334",cat:"regional",seats:102,range:4560,speed:840,fuelL100:608,price:25500000,maint:9120,crew:4050},
  {id:"tupolev-tu-404-concept",name:"Tupolev Tu-404 (concept)",maker:"Tupolev",fam:"Tupolev Tu-404",cat:"jumbo",seats:650,range:13250,speed:905,fuelL100:3775,price:54500000,maint:44500,crew:28000},
  {id:"tupolev-tu-330-projet-cargo",name:"Tupolev Tu-330 (projet cargo)",maker:"Tupolev",fam:"Tupolev Tu-330",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"ilyushin-il-12",name:"Ilyushin Il-12",maker:"Ilyushin",fam:"Ilyushin Il-12",cat:"regional",seats:27,range:2310,speed:840,fuelL100:308,price:6750000,maint:4620,crew:2175},
  {id:"ilyushin-il-14",name:"Ilyushin Il-14",maker:"Ilyushin",fam:"Ilyushin Il-14",cat:"turboprop",seats:32,range:1280,speed:475,fuelL100:176,price:2880000,maint:2780,crew:1280},
  {id:"ilyushin-il-18a-b-d-e",name:"Ilyushin Il-18A/B/D/E",maker:"Ilyushin",fam:"Ilyushin Il-18A/B/D/E",cat:"narrow",seats:122,range:5940,speed:840,fuelL100:1065,price:9760000,maint:9880,crew:4940},
  {id:"ilyushin-il-62",name:"Ilyushin Il-62",maker:"Ilyushin",fam:"Ilyushin Il-62",cat:"narrow",seats:186,range:7220,speed:840,fuelL100:858,price:14880000,maint:12440,crew:6220},
  {id:"ilyushin-il-62m",name:"Ilyushin Il-62M",maker:"Ilyushin",fam:"Ilyushin Il-62M",cat:"narrow",seats:195,range:7400,speed:840,fuelL100:885,price:15600000,maint:12800,crew:6400},
  {id:"ilyushin-il-86",name:"Ilyushin Il-86",maker:"Ilyushin",fam:"Ilyushin Il-86",cat:"wide",seats:350,range:13250,speed:880,fuelL100:3120,price:43000000,maint:20500,crew:13000},
  {id:"ilyushin-il-96-300",name:"Ilyushin Il-96-300",maker:"Ilyushin",fam:"Ilyushin Il-96-300",cat:"wide",seats:300,range:12500,speed:880,fuelL100:2400,price:39000000,maint:19000,crew:12000},
  {id:"ilyushin-il-96-400",name:"Ilyushin Il-96-400",maker:"Ilyushin",fam:"Ilyushin Il-96-400",cat:"jumbo",seats:435,range:12175,speed:905,fuelL100:3452,price:48050000,maint:38050,crew:23700},
  {id:"ilyushin-il-96-400m",name:"Ilyushin Il-96-400M",maker:"Ilyushin",fam:"Ilyushin Il-96-400M",cat:"jumbo",seats:402,range:12010,speed:905,fuelL100:3403,price:47060000,maint:37060,crew:23040},
  {id:"ilyushin-il-96t-cargo",name:"Ilyushin Il-96T (cargo)",maker:"Ilyushin",fam:"Ilyushin Il-96T",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"ilyushin-il-114-100",name:"Ilyushin Il-114-100",maker:"Ilyushin",fam:"Ilyushin Il-114-100",cat:"regional",seats:64,range:3420,speed:840,fuelL100:456,price:16000000,maint:6840,crew:3100},
  {id:"ilyushin-il-114-300",name:"Ilyushin Il-114-300",maker:"Ilyushin",fam:"Ilyushin Il-114-300",cat:"regional",seats:68,range:3540,speed:840,fuelL100:472,price:17000000,maint:7080,crew:3200},
  {id:"antonov-an-2",name:"Antonov An-2",maker:"Antonov",fam:"Antonov An-2",cat:"regional",seats:12,range:1860,speed:840,fuelL100:248,price:5000000,maint:3720,crew:1800},
  {id:"antonov-an-10-cat",name:"Antonov An-10 (Cat)",maker:"Antonov",fam:"Antonov An-10",cat:"narrow",seats:132,range:6140,speed:840,fuelL100:696,price:10560000,maint:10280,crew:5140},
  {id:"antonov-an-24",name:"Antonov An-24",maker:"Antonov",fam:"Antonov An-24",cat:"turboprop",seats:50,range:1550,speed:485,fuelL100:230,price:4500000,maint:3500,crew:1550},
  {id:"antonov-an-26-cargo-pax",name:"Antonov An-26 (cargo/pax)",maker:"Antonov",fam:"Antonov An-26",cat:"turboprop",seats:40,range:1400,speed:480,fuelL100:200,price:3600000,maint:3100,crew:1400},
  {id:"antonov-an-28-pzl-m28",name:"Antonov An-28 / PZL M28",maker:"Antonov",fam:"Antonov An-28",cat:"turboprop",seats:17,range:1055,speed:465,fuelL100:131,price:2000000,maint:2180,crew:1055},
  {id:"antonov-an-32",name:"Antonov An-32",maker:"Antonov",fam:"Antonov An-32",cat:"turboprop",seats:50,range:1550,speed:485,fuelL100:230,price:4500000,maint:3500,crew:1550},
  {id:"antonov-an-38-100",name:"Antonov An-38-100",maker:"Antonov",fam:"Antonov An-38-100",cat:"regional",seats:27,range:2310,speed:840,fuelL100:308,price:6750000,maint:4620,crew:2175},
  {id:"antonov-an-72-74",name:"Antonov An-72/74",maker:"Antonov",fam:"Antonov An-72/74",cat:"regional",seats:52,range:3060,speed:840,fuelL100:408,price:13000000,maint:6120,crew:2800},
  {id:"antonov-an-140",name:"Antonov An-140",maker:"Antonov",fam:"Antonov An-140",cat:"turboprop",seats:52,range:1580,speed:485,fuelL100:236,price:4680000,maint:3580,crew:1580},
  {id:"antonov-an-148-100",name:"Antonov An-148-100",maker:"Antonov",fam:"Antonov An-148-100",cat:"regional",seats:75,range:3750,speed:840,fuelL100:500,price:18750000,maint:7500,crew:3375},
  {id:"antonov-an-158",name:"Antonov An-158",maker:"Antonov",fam:"Antonov An-158",cat:"regional",seats:99,range:4470,speed:840,fuelL100:596,price:24750000,maint:8940,crew:3975},
  {id:"antonov-an-168-projet",name:"Antonov An-168 (projet)",maker:"Antonov",fam:"Antonov An-168",cat:"regional",seats:100,range:4500,speed:840,fuelL100:600,price:25000000,maint:9000,crew:4000},
  {id:"antonov-an-178",name:"Antonov An-178",maker:"Antonov",fam:"Antonov An-178",cat:"regional",seats:99,range:4470,speed:840,fuelL100:596,price:24750000,maint:8940,crew:3975},
  {id:"antonov-an-188-projet",name:"Antonov An-188 (projet)",maker:"Antonov",fam:"Antonov An-188",cat:"narrow",seats:180,range:7100,speed:840,fuelL100:840,price:14400000,maint:12200,crew:6100},
  {id:"antonov-an-218-concept",name:"Antonov An-218 (concept)",maker:"Antonov",fam:"Antonov An-218",cat:"wide",seats:280,range:12200,speed:880,fuelL100:2320,price:37400000,maint:18400,crew:11600},
  {id:"yakovlev-yak-40",name:"Yakovlev Yak-40",maker:"Yakovlev",fam:"Yakovlev Yak-40",cat:"regional",seats:32,range:2460,speed:840,fuelL100:328,price:8000000,maint:4920,crew:2300},
  {id:"yakovlev-yak-42",name:"Yakovlev Yak-42",maker:"Yakovlev",fam:"Yakovlev Yak-42",cat:"narrow",seats:120,range:5900,speed:840,fuelL100:660,price:9600000,maint:9800,crew:4900},
  {id:"yakovlev-yak-42d",name:"Yakovlev Yak-42D",maker:"Yakovlev",fam:"Yakovlev Yak-42D",cat:"narrow",seats:120,range:5900,speed:840,fuelL100:660,price:9600000,maint:9800,crew:4900},
  {id:"yakovlev-yak-46-projet-turboprop",name:"Yakovlev Yak-46 (projet turboprop)",maker:"Yakovlev",fam:"Yakovlev Yak-46",cat:"turboprop",seats:120,range:2500,speed:520,fuelL100:440,price:10800000,maint:6300,crew:2600},
  {id:"yakovlev-yak-88-sst-concept",name:"Yakovlev Yak-88 (SST concept)",maker:"Yakovlev",fam:"Yakovlev Yak-88",cat:"wide",seats:300,range:12500,speed:880,fuelL100:2400,price:39000000,maint:19000,crew:12000},
  {id:"sukhoi-superjet-100-95-ssj100",name:"Sukhoi Superjet 100-95 (SSJ100)",maker:"Sukhoi",fam:"Sukhoi Superjet",cat:"regional",seats:98,range:4440,speed:840,fuelL100:592,price:24500000,maint:8880,crew:3950},
  {id:"ssj-new-ssj100-import-substitution",name:"SSJ-New (SSJ100 import-substitution)",maker:"Irkut",fam:"SSJ-New (SSJ100",cat:"regional",seats:98,range:4440,speed:840,fuelL100:592,price:24500000,maint:8880,crew:3950},
  {id:"mc-21-200",name:"MC-21-200",maker:"Irkut",fam:"MC-21-200",cat:"narrow",seats:132,range:6140,speed:840,fuelL100:696,price:10560000,maint:10280,crew:5140},
  {id:"mc-21-300",name:"MC-21-300",maker:"Irkut",fam:"MC-21-300",cat:"narrow",seats:163,range:6760,speed:840,fuelL100:789,price:13040000,maint:11520,crew:5760},
  {id:"mc-21-310-moteurs-russes",name:"MC-21-310 (moteurs russes)",maker:"Irkut",fam:"MC-21-310 (moteurs",cat:"narrow",seats:163,range:6760,speed:840,fuelL100:789,price:13040000,maint:11520,crew:5760},
  {id:"mc-21-400-projet",name:"MC-21-400 (projet)",maker:"Irkut",fam:"MC-21-400 (projet)",cat:"narrow",seats:212,range:7740,speed:840,fuelL100:936,price:16960000,maint:13480,crew:6740},
  {id:"arj21-700",name:"ARJ21-700",maker:"COMAC",fam:"ARJ21-700",cat:"regional",seats:90,range:4200,speed:840,fuelL100:560,price:22500000,maint:8400,crew:3750},
  {id:"arj21-900",name:"ARJ21-900",maker:"COMAC",fam:"ARJ21-900",cat:"regional",seats:105,range:4650,speed:840,fuelL100:620,price:26250000,maint:9300,crew:4125},
  {id:"c919",name:"C919",maker:"COMAC",fam:"C919",cat:"narrow",seats:158,range:6660,speed:840,fuelL100:774,price:12640000,maint:11320,crew:5660},
  {id:"c929-cr929",name:"C929 (CR929)",maker:"COMAC",fam:"C929 (CR929)",cat:"wide",seats:280,range:12200,speed:880,fuelL100:2320,price:37400000,maint:18400,crew:11600},
  {id:"c939-concept",name:"C939 (concept)",maker:"COMAC",fam:"C939 (concept)",cat:"jumbo",seats:400,range:12000,speed:905,fuelL100:3400,price:47000000,maint:37000,crew:23000},
  {id:"c909-concept",name:"C909 (concept)",maker:"COMAC",fam:"C909 (concept)",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"xian-y-7-an-24-chinois",name:"Xian Y-7 (An-24 chinois)",maker:"Xian",fam:"Xian Y-7",cat:"turboprop",seats:52,range:1580,speed:485,fuelL100:236,price:4680000,maint:3580,crew:1580},
  {id:"xian-ma60",name:"Xian MA60",maker:"Xian",fam:"Xian MA60",cat:"regional",seats:60,range:3300,speed:840,fuelL100:440,price:15000000,maint:6600,crew:3000},
  {id:"xian-ma600",name:"Xian MA600",maker:"Xian",fam:"Xian MA600",cat:"regional",seats:60,range:3300,speed:840,fuelL100:440,price:15000000,maint:6600,crew:3000},
  {id:"xian-ma700",name:"Xian MA700",maker:"Xian",fam:"Xian MA700",cat:"regional",seats:78,range:3840,speed:840,fuelL100:512,price:19500000,maint:7680,crew:3450},
  {id:"xian-h-6-civil-tudes",name:"Xian H-6 (civil, études)",maker:"Xian",fam:"Xian H-6",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"avic-ag600-kunlong-hydravion",name:"AVIC AG600 Kunlong (hydravion)",maker:"AVIC",fam:"AVIC AG600",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"harbin-y-11-yunshuji",name:"Harbin Y-11 (Yunshuji)",maker:"Harbin",fam:"Harbin Y-11",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"harbin-y-12-ii",name:"Harbin Y-12 II",maker:"Harbin",fam:"Harbin Y-12",cat:"turboprop",seats:17,range:1055,speed:465,fuelL100:131,price:2000000,maint:2180,crew:1055},
  {id:"harbin-y-12e",name:"Harbin Y-12E",maker:"Harbin",fam:"Harbin Y-12E",cat:"turboprop",seats:17,range:1055,speed:465,fuelL100:131,price:2000000,maint:2180,crew:1055},
  {id:"harbin-y-12f",name:"Harbin Y-12F",maker:"Harbin",fam:"Harbin Y-12F",cat:"turboprop",seats:17,range:1055,speed:465,fuelL100:131,price:2000000,maint:2180,crew:1055},
  {id:"harbin-z-8-pax-h-lico",name:"Harbin Z-8 (pax hélico)",maker:"Harbin",fam:"Harbin Z-8",cat:"regional",seats:27,range:2310,speed:840,fuelL100:308,price:6750000,maint:4620,crew:2175},
  {id:"namc-ys-11",name:"NAMC YS-11",maker:"NAMC (Japon)",fam:"NAMC YS-11",cat:"regional",seats:60,range:3300,speed:840,fuelL100:440,price:15000000,maint:6600,crew:3000},
  {id:"mitsubishi-spacejet-m90-ex-mrj90",name:"Mitsubishi SpaceJet M90 (ex-MRJ90)",maker:"Mitsubishi",fam:"Mitsubishi SpaceJet",cat:"regional",seats:88,range:4140,speed:840,fuelL100:552,price:22000000,maint:8280,crew:3700},
  {id:"mitsubishi-spacejet-m100-ex-mrj100",name:"Mitsubishi SpaceJet M100 (ex-MRJ100)",maker:"Mitsubishi",fam:"Mitsubishi SpaceJet",cat:"regional",seats:76,range:3780,speed:840,fuelL100:504,price:19000000,maint:7560,crew:3400},
  {id:"short-s-23-empire-hydravion",name:"Short S.23 Empire (hydravion)",maker:"Shorts",fam:"Short S.23",cat:"regional",seats:24,range:2220,speed:840,fuelL100:296,price:6000000,maint:4440,crew:2100},
  {id:"short-s-26-g-class-hydravion",name:"Short S.26 G-Class (hydravion)",maker:"Shorts",fam:"Short S.26",cat:"regional",seats:40,range:2700,speed:840,fuelL100:360,price:10000000,maint:5400,crew:2500},
  {id:"short-sandringham-hydravion",name:"Short Sandringham (hydravion)",maker:"Shorts",fam:"Short Sandringham",cat:"regional",seats:45,range:2850,speed:840,fuelL100:380,price:11250000,maint:5700,crew:2625},
  {id:"short-solent-hydravion",name:"Short Solent (hydravion)",maker:"Shorts",fam:"Short Solent",cat:"regional",seats:39,range:2670,speed:840,fuelL100:356,price:9750000,maint:5340,crew:2475},
  {id:"short-sc-7-skyvan",name:"Short SC.7 Skyvan",maker:"Shorts",fam:"Short SC.7",cat:"regional",seats:19,range:2070,speed:840,fuelL100:276,price:5000000,maint:4140,crew:1975},
  {id:"short-330",name:"Short 330",maker:"Shorts",fam:"Short 330",cat:"regional",seats:30,range:2400,speed:840,fuelL100:320,price:7500000,maint:4800,crew:2250},
  {id:"short-360",name:"Short 360",maker:"Shorts",fam:"Short 360",cat:"regional",seats:36,range:2580,speed:840,fuelL100:344,price:9000000,maint:5160,crew:2400},
  {id:"dhc-3-otter",name:"DHC-3 Otter",maker:"DHC",fam:"DHC-3 Otter",cat:"regional",seats:11,range:1830,speed:840,fuelL100:244,price:5000000,maint:3660,crew:1775},
  {id:"dhc-6-twin-otter-100-200-300",name:"DHC-6 Twin Otter 100/200/300",maker:"DHC",fam:"DHC-6 Twin",cat:"turboprop",seats:20,range:1100,speed:470,fuelL100:140,price:2000000,maint:2300,crew:1100},
  {id:"dhc-6-twin-otter-series-400",name:"DHC-6 Twin Otter Series 400",maker:"Viking Air",fam:"DHC-6 Twin",cat:"turboprop",seats:19,range:1085,speed:465,fuelL100:137,price:2000000,maint:2260,crew:1085},
  {id:"dhc-7-dash-7-stol",name:"DHC-7 Dash 7 (STOL)",maker:"DHC",fam:"DHC-7 Dash",cat:"turboprop",seats:50,range:1550,speed:485,fuelL100:230,price:4500000,maint:3500,crew:1550},
  {id:"dhc-8-dash-8-100-200-300-400",name:"DHC-8 Dash 8 100/200/300/400",maker:"DHC",fam:"DHC-8 Dash",cat:"regional",seats:78,range:3840,speed:840,fuelL100:512,price:19500000,maint:7680,crew:3450},
  {id:"cessna-208-caravan",name:"Cessna 208 Caravan",maker:"Cessna",fam:"Cessna 208",cat:"regional",seats:14,range:1920,speed:840,fuelL100:256,price:5000000,maint:3840,crew:1850},
  {id:"cessna-208b-grand-caravan",name:"Cessna 208B Grand Caravan",maker:"Cessna",fam:"Cessna 208B",cat:"regional",seats:14,range:1920,speed:840,fuelL100:256,price:5000000,maint:3840,crew:1850},
  {id:"cessna-208b-ex-grand-caravan",name:"Cessna 208B EX Grand Caravan",maker:"Cessna",fam:"Cessna 208B",cat:"regional",seats:14,range:1920,speed:840,fuelL100:256,price:5000000,maint:3840,crew:1850},
  {id:"cessna-skycourier-408-pax",name:"Cessna SkyCourier 408 (pax)",maker:"Cessna",fam:"Cessna SkyCourier",cat:"regional",seats:19,range:2070,speed:840,fuelL100:276,price:5000000,maint:4140,crew:1975},
  {id:"citation-longitude",name:"Citation Longitude",maker:"Cessna",fam:"Citation Longitude",cat:"regional",seats:12,range:1860,speed:840,fuelL100:248,price:5000000,maint:3720,crew:1800},
  {id:"citation-latitude",name:"Citation Latitude",maker:"Cessna",fam:"Citation Latitude",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"citation-sovereign",name:"Citation Sovereign+",maker:"Cessna",fam:"Citation Sovereign+",cat:"regional",seats:12,range:1860,speed:840,fuelL100:248,price:5000000,maint:3720,crew:1800},
  {id:"citation-x",name:"Citation X+",maker:"Cessna",fam:"Citation X+",cat:"regional",seats:12,range:1860,speed:840,fuelL100:248,price:5000000,maint:3720,crew:1800},
  {id:"textron-denali-turboprop",name:"Textron Denali (turboprop)",maker:"Textron",fam:"Textron Denali",cat:"turboprop",seats:11,range:965,speed:465,fuelL100:113,price:2000000,maint:1940,crew:965},
  {id:"gulfstream-i-turboprop",name:"Gulfstream I (turboprop)",maker:"Gulfstream",fam:"Gulfstream I",cat:"turboprop",seats:19,range:1085,speed:465,fuelL100:137,price:2000000,maint:2260,crew:1085},
  {id:"gulfstream-ii",name:"Gulfstream II",maker:"Gulfstream",fam:"Gulfstream II",cat:"regional",seats:19,range:2070,speed:840,fuelL100:276,price:5000000,maint:4140,crew:1975},
  {id:"gulfstream-iii",name:"Gulfstream III",maker:"Gulfstream",fam:"Gulfstream III",cat:"regional",seats:19,range:2070,speed:840,fuelL100:276,price:5000000,maint:4140,crew:1975},
  {id:"gulfstream-iv-iv-sp",name:"Gulfstream IV/IV-SP",maker:"Gulfstream",fam:"Gulfstream IV/IV-SP",cat:"regional",seats:19,range:2070,speed:840,fuelL100:276,price:5000000,maint:4140,crew:1975},
  {id:"gulfstream-v",name:"Gulfstream V",maker:"Gulfstream",fam:"Gulfstream V",cat:"regional",seats:19,range:2070,speed:840,fuelL100:276,price:5000000,maint:4140,crew:1975},
  {id:"gulfstream-g200-ex-galaxy",name:"Gulfstream G200 (ex-Galaxy)",maker:"Gulfstream",fam:"Gulfstream G200",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"gulfstream-g280",name:"Gulfstream G280",maker:"Gulfstream",fam:"Gulfstream G280",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"gulfstream-g300",name:"Gulfstream G300",maker:"Gulfstream",fam:"Gulfstream G300",cat:"regional",seats:14,range:1920,speed:840,fuelL100:256,price:5000000,maint:3840,crew:1850},
  {id:"gulfstream-g350",name:"Gulfstream G350",maker:"Gulfstream",fam:"Gulfstream G350",cat:"regional",seats:14,range:1920,speed:840,fuelL100:256,price:5000000,maint:3840,crew:1850},
  {id:"gulfstream-g400",name:"Gulfstream G400",maker:"Gulfstream",fam:"Gulfstream G400",cat:"regional",seats:15,range:1950,speed:840,fuelL100:260,price:5000000,maint:3900,crew:1875},
  {id:"gulfstream-g450",name:"Gulfstream G450",maker:"Gulfstream",fam:"Gulfstream G450",cat:"regional",seats:14,range:1920,speed:840,fuelL100:256,price:5000000,maint:3840,crew:1850},
  {id:"gulfstream-g500",name:"Gulfstream G500",maker:"Gulfstream",fam:"Gulfstream G500",cat:"regional",seats:16,range:1980,speed:840,fuelL100:264,price:5000000,maint:3960,crew:1900},
  {id:"gulfstream-g550",name:"Gulfstream G550",maker:"Gulfstream",fam:"Gulfstream G550",cat:"regional",seats:18,range:2040,speed:840,fuelL100:272,price:5000000,maint:4080,crew:1950},
  {id:"gulfstream-g600",name:"Gulfstream G600",maker:"Gulfstream",fam:"Gulfstream G600",cat:"regional",seats:16,range:1980,speed:840,fuelL100:264,price:5000000,maint:3960,crew:1900},
  {id:"gulfstream-g650",name:"Gulfstream G650",maker:"Gulfstream",fam:"Gulfstream G650",cat:"regional",seats:18,range:2040,speed:840,fuelL100:272,price:5000000,maint:4080,crew:1950},
  {id:"gulfstream-g650er",name:"Gulfstream G650ER",maker:"Gulfstream",fam:"Gulfstream G650ER",cat:"regional",seats:18,range:2040,speed:840,fuelL100:272,price:5000000,maint:4080,crew:1950},
  {id:"gulfstream-g700",name:"Gulfstream G700",maker:"Gulfstream",fam:"Gulfstream G700",cat:"regional",seats:19,range:2070,speed:840,fuelL100:276,price:5000000,maint:4140,crew:1975},
  {id:"gulfstream-g800",name:"Gulfstream G800",maker:"Gulfstream",fam:"Gulfstream G800",cat:"regional",seats:19,range:2070,speed:840,fuelL100:276,price:5000000,maint:4140,crew:1975},
  {id:"dassault-falcon-20",name:"Dassault Falcon 20",maker:"Dassault",fam:"Dassault Falcon",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"dassault-falcon-900",name:"Dassault Falcon 900",maker:"Dassault",fam:"Dassault Falcon",cat:"regional",seats:12,range:1860,speed:840,fuelL100:248,price:5000000,maint:3720,crew:1800},
  {id:"dassault-falcon-900ex",name:"Dassault Falcon 900EX",maker:"Dassault",fam:"Dassault Falcon",cat:"regional",seats:12,range:1860,speed:840,fuelL100:248,price:5000000,maint:3720,crew:1800},
  {id:"dassault-falcon-900ex-easy",name:"Dassault Falcon 900EX EASy",maker:"Dassault",fam:"Dassault Falcon",cat:"regional",seats:12,range:1860,speed:840,fuelL100:248,price:5000000,maint:3720,crew:1800},
  {id:"dassault-falcon-2000",name:"Dassault Falcon 2000",maker:"Dassault",fam:"Dassault Falcon",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"dassault-falcon-2000ex",name:"Dassault Falcon 2000EX",maker:"Dassault",fam:"Dassault Falcon",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"dassault-falcon-2000lx",name:"Dassault Falcon 2000LX",maker:"Dassault",fam:"Dassault Falcon",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"dassault-falcon-2000s",name:"Dassault Falcon 2000S",maker:"Dassault",fam:"Dassault Falcon",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"dassault-falcon-7x",name:"Dassault Falcon 7X",maker:"Dassault",fam:"Dassault Falcon",cat:"regional",seats:14,range:1920,speed:840,fuelL100:256,price:5000000,maint:3840,crew:1850},
  {id:"dassault-falcon-8x",name:"Dassault Falcon 8X",maker:"Dassault",fam:"Dassault Falcon",cat:"regional",seats:14,range:1920,speed:840,fuelL100:256,price:5000000,maint:3840,crew:1850},
  {id:"dassault-falcon-10x",name:"Dassault Falcon 10X",maker:"Dassault",fam:"Dassault Falcon",cat:"regional",seats:16,range:1980,speed:840,fuelL100:264,price:5000000,maint:3960,crew:1900},
  {id:"dassault-falcon-6x",name:"Dassault Falcon 6X",maker:"Dassault",fam:"Dassault Falcon",cat:"regional",seats:16,range:1980,speed:840,fuelL100:264,price:5000000,maint:3960,crew:1900},
  {id:"pilatus-pc-12-ng",name:"Pilatus PC-12 NG",maker:"Pilatus",fam:"Pilatus PC-12",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"pilatus-pc-12-ngx",name:"Pilatus PC-12 NGX",maker:"Pilatus",fam:"Pilatus PC-12",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"pilatus-pc-24",name:"Pilatus PC-24",maker:"Pilatus",fam:"Pilatus PC-24",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"let-l-410-turbolet-200",name:"Let L-410 Turbolet 200",maker:"Let",fam:"Let L-410",cat:"regional",seats:19,range:2070,speed:840,fuelL100:276,price:5000000,maint:4140,crew:1975},
  {id:"let-l-410-ng",name:"Let L-410 NG",maker:"Aircraft Industries",fam:"Let L-410",cat:"regional",seats:19,range:2070,speed:840,fuelL100:276,price:5000000,maint:4140,crew:1975},
  {id:"let-l-610-annul",name:"Let L-610 (annulé)",maker:"Let",fam:"Let L-610",cat:"regional",seats:40,range:2700,speed:840,fuelL100:360,price:10000000,maint:5400,crew:2500},
  {id:"let-l-420-civil-small",name:"Let L-420 (civil small)",maker:"Let",fam:"Let L-420",cat:"regional",seats:19,range:2070,speed:840,fuelL100:276,price:5000000,maint:4140,crew:1975},
  {id:"casa-cn-235-100",name:"CASA CN-235-100",maker:"CASA",fam:"CASA CN-235-100",cat:"regional",seats:45,range:2850,speed:840,fuelL100:380,price:11250000,maint:5700,crew:2625},
  {id:"casa-c-295",name:"CASA C-295",maker:"CASA",fam:"CASA C-295",cat:"regional",seats:72,range:3660,speed:840,fuelL100:488,price:18000000,maint:7320,crew:3300},
  {id:"iptn-nc-212-aviocar",name:"IPTN NC-212 Aviocar",maker:"IPTN",fam:"IPTN NC-212",cat:"regional",seats:26,range:2280,speed:840,fuelL100:304,price:6500000,maint:4560,crew:2150},
  {id:"iptn-n-250-gatotkaca",name:"IPTN N-250 (Gatotkaca)",maker:"IPTN",fam:"IPTN N-250",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"iptn-n-2130-concept",name:"IPTN N-2130 (concept)",maker:"IPTN",fam:"IPTN N-2130",cat:"narrow",seats:130,range:6100,speed:840,fuelL100:690,price:10400000,maint:10200,crew:5100},
  {id:"pzl-m28-skytruck",name:"PZL M28 Skytruck",maker:"PZL",fam:"PZL M28",cat:"turboprop",seats:19,range:1085,speed:465,fuelL100:137,price:2000000,maint:2260,crew:1085},
  {id:"pzl-m28-bryza",name:"PZL M28 Bryza",maker:"PZL",fam:"PZL M28",cat:"turboprop",seats:19,range:1085,speed:465,fuelL100:137,price:2000000,maint:2260,crew:1085},
  {id:"gippsaero-ga8-airvan",name:"GippsAero GA8 Airvan",maker:"GippsAero",fam:"GippsAero GA8",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"gippsaero-ga10",name:"GippsAero GA10",maker:"GippsAero",fam:"GippsAero GA10",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"britten-norman-bn-2-islander",name:"Britten-Norman BN-2 Islander",maker:"Britten-Norman",fam:"Britten-Norman BN-2",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"britten-norman-bn-2t-turbine-island",name:"Britten-Norman BN-2T Turbine Islander",maker:"Britten-Norman",fam:"Britten-Norman BN-2T",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"britten-norman-bn-2a-mk-iii-trislan",name:"Britten-Norman BN-2A Mk III Trislander",maker:"Britten-Norman",fam:"Britten-Norman BN-2A",cat:"regional",seats:17,range:2010,speed:840,fuelL100:268,price:5000000,maint:4020,crew:1925},
  {id:"britten-norman-bn-2b",name:"Britten-Norman BN-2B",maker:"Britten-Norman",fam:"Britten-Norman BN-2B",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"islander-bn-2t-4s-defender-4000",name:"Islander BN-2T-4S Defender 4000",maker:"Britten-Norman",fam:"Islander BN-2T-4S",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"beriev-be-12-tcha-ka-amphibie",name:"Beriev Be-12 Tchaïka (amphibie)",maker:"Beriev",fam:"Beriev Be-12",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"beriev-be-103",name:"Beriev Be-103",maker:"Beriev",fam:"Beriev Be-103",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"beriev-be-200-altair",name:"Beriev Be-200 Altair",maker:"Beriev",fam:"Beriev Be-200",cat:"regional",seats:72,range:3660,speed:840,fuelL100:488,price:18000000,maint:7320,crew:3300},
  {id:"beriev-be-200es-e-export",name:"Beriev Be-200ES-E (export)",maker:"Beriev",fam:"Beriev Be-200ES-E",cat:"regional",seats:72,range:3660,speed:840,fuelL100:488,price:18000000,maint:7320,crew:3300},
  {id:"beriev-be-101-concept-grand",name:"Beriev Be-101 (concept grand)",maker:"Beriev",fam:"Beriev Be-101",cat:"narrow",seats:150,range:6500,speed:840,fuelL100:750,price:12000000,maint:11000,crew:5500},
  {id:"shinmaywa-us-1a",name:"ShinMaywa US-1A",maker:"ShinMaywa",fam:"ShinMaywa US-1A",cat:"regional",seats:12,range:1860,speed:840,fuelL100:248,price:5000000,maint:3720,crew:1800},
  {id:"shinmaywa-us-2",name:"ShinMaywa US-2",maker:"ShinMaywa",fam:"ShinMaywa US-2",cat:"regional",seats:20,range:2100,speed:840,fuelL100:280,price:5000000,maint:4200,crew:2000},
  {id:"concorde-bac-a-rospatiale",name:"Concorde (BAC/Aérospatiale)",maker:"BAC",fam:"Concorde (BAC/Aérospatiale)",cat:"supersonic",seats:100,range:7000,speed:2100,fuelL100:2500,price:150000000,maint:70000,crew:25000},
  {id:"tupolev-tu-144-urss-sst",name:"Tupolev Tu-144 (URSS SST)",maker:"Tupolev",fam:"Tupolev Tu-144",cat:"supersonic",seats:150,range:7500,speed:2100,fuelL100:3750,price:150000000,maint:80000,crew:30000},
  {id:"boeing-2707-200",name:"Boeing 2707-200",maker:"Boeing",fam:"Boeing 2707-200",cat:"supersonic",seats:300,range:9000,speed:2100,fuelL100:7500,price:150000000,maint:110000,crew:45000},
  {id:"boeing-2707-300",name:"Boeing 2707-300",maker:"Boeing",fam:"Boeing 2707-300",cat:"supersonic",seats:234,range:8340,speed:2100,fuelL100:5850,price:150000000,maint:96800,crew:38400},
  {id:"lockheed-l-2000",name:"Lockheed L-2000",maker:"Lockheed",fam:"Lockheed L-2000",cat:"wide",seats:273,range:12095,speed:880,fuelL100:2292,price:36840000,maint:18190,crew:11460},
  {id:"aerion-as2",name:"Aerion AS2",maker:"Aerion Supersonic",fam:"Aerion AS2",cat:"supersonic",seats:12,range:6120,speed:2100,fuelL100:300,price:150000000,maint:52400,crew:16200},
  {id:"aerion-as3",name:"Aerion AS3",maker:"Aerion Supersonic",fam:"Aerion AS3",cat:"supersonic",seats:50,range:6500,speed:2100,fuelL100:1250,price:150000000,maint:60000,crew:20000},
  {id:"boom-overture",name:"Boom Overture",maker:"Boom Supersonic",fam:"Boom Overture",cat:"supersonic",seats:76,range:6760,speed:2100,fuelL100:1900,price:150000000,maint:65200,crew:22600},
  {id:"boom-xb-1-d-monstrateur",name:"Boom XB-1 (démonstrateur)",maker:"Boom Supersonic",fam:"Boom XB-1",cat:"supersonic",seats:50,range:6500,speed:2100,fuelL100:1250,price:150000000,maint:60000,crew:20000},
  {id:"spike-aerospace-s-512",name:"Spike Aerospace S-512",maker:"Spike Aerospace",fam:"Spike Aerospace",cat:"supersonic",seats:15,range:6150,speed:2100,fuelL100:375,price:150000000,maint:53000,crew:16500},
  {id:"hermeus-quarterhorse-halcyon",name:"Hermeus Quarterhorse (Halcyon)",maker:"Hermeus",fam:"Hermeus Quarterhorse",cat:"regional",seats:20,range:2100,speed:840,fuelL100:280,price:5000000,maint:4200,crew:2000},
  {id:"venus-aerospace-stargazer",name:"Venus Aerospace Stargazer",maker:"Venus Aerospace",fam:"Venus Aerospace",cat:"regional",seats:12,range:1860,speed:840,fuelL100:248,price:5000000,maint:3720,crew:1800},
  {id:"exosonic-sst",name:"Exosonic SST",maker:"Exosonic",fam:"Exosonic SST",cat:"regional",seats:70,range:3600,speed:840,fuelL100:480,price:17500000,maint:7200,crew:3250},
  {id:"airbus-zehst-concept",name:"Airbus ZEHST (concept)",maker:"Airbus",fam:"Airbus ZEHST",cat:"regional",seats:100,range:4500,speed:840,fuelL100:600,price:25000000,maint:9000,crew:4000},
  {id:"concorde-2-concept-airbus",name:"Concorde 2 (concept Airbus)",maker:"Airbus",fam:"Concorde 2",cat:"supersonic",seats:100,range:7000,speed:2100,fuelL100:2500,price:150000000,maint:70000,crew:25000},
  {id:"lapcat-a2-hypersonique-eu",name:"LAPCAT A2 (hypersonique EU)",maker:"ESA",fam:"LAPCAT A2",cat:"wide",seats:300,range:12500,speed:880,fuelL100:2400,price:39000000,maint:19000,crew:12000},
  {id:"hisac-eu-sst-project",name:"HISAC (EU SST project)",maker:"EU Consortium",fam:"HISAC (EU",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"quiet-supersonic-technology-qsst",name:"Quiet SuperSonic Technology (QSST)",maker:"Sukhoi",fam:"Quiet SuperSonic",cat:"regional",seats:12,range:1860,speed:840,fuelL100:248,price:5000000,maint:3720,crew:1800},
  {id:"as2-ssbj-gulfstream-aerion",name:"AS2 SSBJ (Gulfstream/Aerion)",maker:"Gulfstream",fam:"AS2 SSBJ",cat:"supersonic",seats:12,range:6120,speed:2100,fuelL100:300,price:150000000,maint:52400,crew:16200},
  {id:"nasa-n-3-sst-concept",name:"NASA N+3 SST concept",maker:"NASA",fam:"NASA N+3",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"reaction-engines-a2-skylon-pax",name:"Reaction Engines A2 (Skylon pax)",maker:"Reaction Engines",fam:"Reaction Engines",cat:"wide",seats:300,range:12500,speed:880,fuelL100:2400,price:39000000,maint:19000,crew:12000},
  {id:"destinus-h2-hypersonique",name:"Destinus (H2 hypersonique)",maker:"Destinus",fam:"Destinus (H2",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"heart-aerospace-es-30",name:"Heart Aerospace ES-30",maker:"Heart Aerospace",fam:"Heart Aerospace",cat:"regional",seats:30,range:2400,speed:840,fuelL100:320,price:7500000,maint:4800,crew:2250},
  {id:"heart-aerospace-es-19-ancien-projet",name:"Heart Aerospace ES-19 (ancien projet)",maker:"Heart Aerospace",fam:"Heart Aerospace",cat:"regional",seats:19,range:2070,speed:840,fuelL100:276,price:5000000,maint:4140,crew:1975},
  {id:"eviation-alice-cargo-pax",name:"Eviation Alice (cargo/pax)",maker:"Eviation Aircraft",fam:"Eviation Alice",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"wright-electric-wr-1",name:"Wright Electric WR-1",maker:"Wright Electric",fam:"Wright Electric",cat:"narrow",seats:186,range:7220,speed:840,fuelL100:858,price:14880000,maint:12440,crew:6220},
  {id:"ampaire-electric-eel",name:"Ampaire Electric EEL",maker:"Ampaire",fam:"Ampaire Electric",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"zeroavia-dornier-228-h2",name:"ZeroAvia Dornier 228 (H2)",maker:"ZeroAvia",fam:"ZeroAvia Dornier",cat:"regional",seats:19,range:2070,speed:840,fuelL100:276,price:5000000,maint:4140,crew:1975},
  {id:"zeroavia-atr-72-h2-projet",name:"ZeroAvia ATR 72 (H2 projet)",maker:"ZeroAvia",fam:"ZeroAvia ATR",cat:"turboprop",seats:72,range:1880,speed:495,fuelL100:296,price:6480000,maint:4380,crew:1880},
  {id:"universal-hydrogen-atr-72",name:"Universal Hydrogen ATR 72",maker:"Universal Hydrogen",fam:"Universal Hydrogen",cat:"turboprop",seats:72,range:1880,speed:495,fuelL100:296,price:6480000,maint:4380,crew:1880},
  {id:"airbus-e-fan-x-hybride",name:"Airbus E-Fan X (hybride)",maker:"Airbus",fam:"Airbus E-Fan",cat:"narrow",seats:180,range:7100,speed:840,fuelL100:840,price:14400000,maint:12200,crew:6100},
  {id:"voltaero-cassio-4-hybride",name:"VoltAero Cassio 4 (hybride)",maker:"VoltAero",fam:"VoltAero Cassio",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"bye-aerospace-eflyer-800",name:"Bye Aerospace eFlyer 800",maker:"Bye Aerospace",fam:"Bye Aerospace",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"otto-aviation-celera-500l",name:"Otto Aviation Celera 500L",maker:"Otto Aviation",fam:"Otto Aviation",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"nasa-x-57-maxwell-lectrique",name:"NASA X-57 Maxwell (électrique)",maker:"NASA",fam:"NASA X-57",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"lilium-jet-evtol",name:"Lilium Jet (eVTOL)",maker:"Lilium",fam:"Lilium Jet",cat:"regional",seats:16,range:1980,speed:840,fuelL100:264,price:5000000,maint:3960,crew:1900},
  {id:"lilium-jet-rachet-relanc",name:"Lilium Jet (racheté, relancé)",maker:"Lilium GmbH (nouveau",fam:"Lilium Jet",cat:"regional",seats:16,range:1980,speed:840,fuelL100:264,price:5000000,maint:3960,crew:1900},
  {id:"tecnam-p-volt",name:"Tecnam P-Volt",maker:"Tecnam",fam:"Tecnam P-Volt",cat:"regional",seats:19,range:2070,speed:840,fuelL100:276,price:5000000,maint:4140,crew:1975},
  {id:"magnix-harbour-air-dhc-2-beaver",name:"MagniX/Harbour Air DHC-2 Beaver",maker:"MagniX",fam:"MagniX/Harbour Air",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"pipistrel-miniliner-concept",name:"Pipistrel Miniliner (concept)",maker:"Pipistrel",fam:"Pipistrel Miniliner",cat:"regional",seats:19,range:2070,speed:840,fuelL100:276,price:5000000,maint:4140,crew:1975},
  {id:"dlr-hy4-h2-pax",name:"DLR HY4 (H2 pax)",maker:"DLR",fam:"DLR HY4",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"airflow-electric-twin-turbo",name:"Airflow Electric (twin turbo)",maker:"Airflow LLC",fam:"Airflow Electric",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"boeing-x-48b-x-48c-bwb",name:"Boeing X-48B / X-48C (BWB)",maker:"Boeing",fam:"Boeing X-48B",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"jetzero-z4-bwb",name:"JetZero Z4 (BWB)",maker:"JetZero",fam:"JetZero Z4",cat:"wide",seats:250,range:11750,speed:880,fuelL100:2200,price:35000000,maint:17500,crew:11000},
  {id:"airbus-maveric-bwb",name:"Airbus MAVERIC (BWB)",maker:"Airbus",fam:"Airbus MAVERIC",cat:"narrow",seats:200,range:7500,speed:840,fuelL100:900,price:16000000,maint:13000,crew:6500},
  {id:"dzyne-technologies-bw-1-bwb",name:"DZYNE Technologies BW-1 (BWB)",maker:"DZYNE",fam:"DZYNE Technologies",cat:"wide",seats:250,range:11750,speed:880,fuelL100:2200,price:35000000,maint:17500,crew:11000},
  {id:"tu-delft-flying-v",name:"TU Delft Flying-V",maker:"TU Delft",fam:"TU Delft",cat:"wide",seats:314,range:12710,speed:880,fuelL100:2456,price:40120000,maint:19420,crew:12280},
  {id:"lockheed-martin-box-wing-lmxt",name:"Lockheed Martin Box Wing (LMxt)",maker:"Lockheed Martin",fam:"Lockheed Martin",cat:"narrow",seats:200,range:7500,speed:840,fuelL100:900,price:16000000,maint:13000,crew:6500},
  {id:"mit-d8-double-bubble",name:"MIT D8 Double Bubble",maker:"MIT",fam:"MIT D8",cat:"narrow",seats:180,range:7100,speed:840,fuelL100:840,price:14400000,maint:12200,crew:6100},
  {id:"sugar-volt-boeing-nasa",name:"SUGAR Volt (Boeing/NASA)",maker:"Boeing",fam:"SUGAR Volt",cat:"narrow",seats:154,range:6580,speed:840,fuelL100:762,price:12320000,maint:11160,crew:5580},
  {id:"aurora-sugar-truss-braced",name:"Aurora SUGAR (truss-braced)",maker:"Aurora",fam:"Aurora SUGAR",cat:"narrow",seats:150,range:6500,speed:840,fuelL100:750,price:12000000,maint:11000,crew:5500},
  {id:"nasa-starc-abl-concept",name:"NASA STARC-ABL (concept)",maker:"NASA",fam:"NASA STARC-ABL",cat:"narrow",seats:150,range:6500,speed:840,fuelL100:750,price:12000000,maint:11000,crew:5500},
  {id:"celera-500l-otto-aviation",name:"Celera 500L (Otto Aviation)",maker:"Otto Aviation",fam:"Celera 500L",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"bauhaus-luftfahrt-ce-liner",name:"Bauhaus Luftfahrt Ce-Liner",maker:"Bauhaus Luftfahrt",fam:"Bauhaus Luftfahrt",cat:"narrow",seats:189,range:7280,speed:840,fuelL100:867,price:15120000,maint:12560,crew:6280},
  {id:"airbus-albatross-concept-interne",name:"Airbus Albatross (concept interne)",maker:"Airbus",fam:"Airbus Albatross",cat:"turboprop",seats:200,range:2500,speed:560,fuelL100:680,price:18000000,maint:9500,crew:3800},
  {id:"onera-dragon-concept-turbofan-distr",name:"Onera DRAGON (concept turbofan distribué)",maker:"Onera",fam:"Onera DRAGON",cat:"narrow",seats:150,range:6500,speed:840,fuelL100:750,price:12000000,maint:11000,crew:5500},
  {id:"ford-4-at-trimotor",name:"Ford 4-AT Trimotor",maker:"Ford",fam:"Ford 4-AT",cat:"regional",seats:11,range:1830,speed:840,fuelL100:244,price:5000000,maint:3660,crew:1775},
  {id:"ford-5-at-trimotor",name:"Ford 5-AT Trimotor",maker:"Ford",fam:"Ford 5-AT",cat:"regional",seats:13,range:1890,speed:840,fuelL100:252,price:5000000,maint:3780,crew:1825},
  {id:"junkers-ju-52-3m",name:"Junkers Ju 52/3m",maker:"Junkers",fam:"Junkers Ju",cat:"regional",seats:17,range:2010,speed:840,fuelL100:268,price:5000000,maint:4020,crew:1925},
  {id:"junkers-g-38",name:"Junkers G.38",maker:"Junkers",fam:"Junkers G.38",cat:"regional",seats:34,range:2520,speed:840,fuelL100:336,price:8500000,maint:5040,crew:2350},
  {id:"fokker-f-vii-3m-3-moteurs",name:"Fokker F.VII/3m (3 moteurs)",maker:"Fokker",fam:"Fokker F.VII/3m",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"sikorsky-s-40-hydravion",name:"Sikorsky S-40 (hydravion)",maker:"Sikorsky",fam:"Sikorsky S-40",cat:"regional",seats:40,range:2700,speed:840,fuelL100:360,price:10000000,maint:5400,crew:2500},
  {id:"sikorsky-s-42-hydravion",name:"Sikorsky S-42 (hydravion)",maker:"Sikorsky",fam:"Sikorsky S-42",cat:"regional",seats:32,range:2460,speed:840,fuelL100:328,price:8000000,maint:4920,crew:2300},
  {id:"martin-m-130-china-clipper-hydravio",name:"Martin M-130 China Clipper (hydravion)",maker:"Martin",fam:"Martin M-130",cat:"regional",seats:32,range:2460,speed:840,fuelL100:328,price:8000000,maint:4920,crew:2300},
  {id:"boeing-314-clipper-hydravion-1",name:"Boeing 314 Clipper (hydravion)",maker:"Boeing",fam:"Boeing 314",cat:"regional",seats:74,range:3720,speed:840,fuelL100:496,price:18500000,maint:7440,crew:3350},
  {id:"hughes-h-4-hercules-spruce-goose",name:"Hughes H-4 Hercules (Spruce Goose)",maker:"Hughes Aircraft",fam:"Hughes H-4",cat:"jumbo",seats:700,range:13500,speed:905,fuelL100:3850,price:56000000,maint:46000,crew:29000},
  {id:"dornier-do-x-hydravion-1",name:"Dornier Do X (hydravion)",maker:"Dornier",fam:"Dornier Do",cat:"regional",seats:66,range:3480,speed:840,fuelL100:464,price:16500000,maint:6960,crew:3150},
  {id:"handley-page-h-p-42",name:"Handley Page H.P.42",maker:"Handley Page",fam:"Handley Page",cat:"regional",seats:38,range:2640,speed:840,fuelL100:352,price:9500000,maint:5280,crew:2450},
  {id:"armstrong-whitworth-atlanta",name:"Armstrong Whitworth Atlanta",maker:"Armstrong Whitworth",fam:"Armstrong Whitworth",cat:"regional",seats:38,range:2640,speed:840,fuelL100:352,price:9500000,maint:5280,crew:2450},
  {id:"bleriot-125-a-ropostale",name:"Bleriot 125 (Aéropostale)",maker:"Blériot",fam:"Bleriot 125",cat:"regional",seats:12,range:1860,speed:840,fuelL100:248,price:5000000,maint:3720,crew:1800},
  {id:"lat-co-re-631-hydravion",name:"Latécoère 631 (hydravion)",maker:"Latécoère",fam:"Latécoère 631",cat:"regional",seats:46,range:2880,speed:840,fuelL100:384,price:11500000,maint:5760,crew:2650},
  {id:"lat-co-re-300-croix-du-sud",name:"Latécoère 300 Croix du Sud",maker:"Latécoère",fam:"Latécoère 300",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"couzinet-70-arc-en-ciel",name:"Couzinet 70 Arc-en-Ciel",maker:"Couzinet",fam:"Couzinet 70",cat:"regional",seats:12,range:1860,speed:840,fuelL100:248,price:5000000,maint:3720,crew:1800},
  {id:"breguet-763-deux-ponts-provence",name:"Breguet 763 Deux-Ponts (Provence)",maker:"Breguet",fam:"Breguet 763",cat:"regional",seats:107,range:4710,speed:840,fuelL100:628,price:26750000,maint:9420,crew:4175},
  {id:"breguet-790-m-t-ore-concept",name:"Breguet 790 Météore (concept)",maker:"Breguet",fam:"Breguet 790",cat:"narrow",seats:200,range:7500,speed:840,fuelL100:900,price:16000000,maint:13000,crew:6500},
  {id:"potez-160-concept",name:"Potez 160 (concept)",maker:"Potez",fam:"Potez 160",cat:"regional",seats:20,range:2100,speed:840,fuelL100:280,price:5000000,maint:4200,crew:2000},
  {id:"dewoitine-d-33-long-courrier-pax",name:"Dewoitine D.33 (long courrier pax)",maker:"Dewoitine",fam:"Dewoitine D.33",cat:"regional",seats:12,range:1860,speed:840,fuelL100:248,price:5000000,maint:3720,crew:1800},
  {id:"hal-748-avro-748-licence",name:"HAL-748 (Avro 748 licence)",maker:"HAL",fam:"HAL-748 (Avro",cat:"regional",seats:40,range:2700,speed:840,fuelL100:360,price:10000000,maint:5400,crew:2500},
  {id:"hal-saras-pt1",name:"HAL Saras PT1",maker:"HAL",fam:"HAL Saras",cat:"regional",seats:14,range:1920,speed:840,fuelL100:256,price:5000000,maint:3840,crew:1850},
  {id:"hal-saras-mk2-projet",name:"HAL Saras Mk2 (projet)",maker:"HAL",fam:"HAL Saras",cat:"regional",seats:19,range:2070,speed:840,fuelL100:276,price:5000000,maint:4140,crew:1975},
  {id:"tata-skyshuttle-concept",name:"TATA SkyShuttle (concept)",maker:"Tata",fam:"TATA SkyShuttle",cat:"regional",seats:19,range:2070,speed:840,fuelL100:276,price:5000000,maint:4140,crew:1975},
  {id:"sud-ouest-so-30-bretagne",name:"Sud-Ouest SO.30 Bretagne",maker:"SNCASE",fam:"Sud-Ouest SO.30",cat:"regional",seats:37,range:2610,speed:840,fuelL100:348,price:9250000,maint:5220,crew:2425},
  {id:"sud-aviation-se-210-caravelle-i",name:"Sud Aviation SE 210 Caravelle I",maker:"Sud Aviation",fam:"Sud Aviation",cat:"regional",seats:80,range:3900,speed:840,fuelL100:520,price:20000000,maint:7800,crew:3500},
  {id:"caravelle-ia-ib-iii-vin-vir",name:"Caravelle IA, IB, III, VIN, VIR",maker:"Sud Aviation",fam:"Caravelle IA,",cat:"regional",seats:89,range:4170,speed:840,fuelL100:556,price:22250000,maint:8340,crew:3725},
  {id:"caravelle-10b-super-b",name:"Caravelle 10B Super B",maker:"Sud Aviation",fam:"Caravelle 10B",cat:"regional",seats:105,range:4650,speed:840,fuelL100:620,price:26250000,maint:9300,crew:4125},
  {id:"caravelle-11r-cargo",name:"Caravelle 11R (cargo)",maker:"Sud Aviation",fam:"Caravelle 11R",cat:"regional",seats:89,range:4170,speed:840,fuelL100:556,price:22250000,maint:8340,crew:3725},
  {id:"caravelle-12",name:"Caravelle 12",maker:"Sud Aviation",fam:"Caravelle 12",cat:"narrow",seats:140,range:6300,speed:840,fuelL100:1152,price:11200000,maint:10600,crew:5300},
  {id:"sn600-corvette-bizjet",name:"SN600 Corvette (bizjet)",maker:"Aérospatiale",fam:"SN600 Corvette",cat:"regional",seats:14,range:1920,speed:840,fuelL100:256,price:5000000,maint:3840,crew:1850},
  {id:"a-rospatiale-n-500-projet-sst",name:"Aérospatiale N 500 (projet SST)",maker:"Aérospatiale",fam:"Aérospatiale N",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"canadair-c-4-north-star",name:"Canadair C-4 North Star",maker:"Canadair",fam:"Canadair C-4",cat:"regional",seats:40,range:2700,speed:840,fuelL100:360,price:10000000,maint:5400,crew:2500},
  {id:"canadair-cl-44-swing-tail",name:"Canadair CL-44 (Swing-tail)",maker:"Canadair",fam:"Canadair CL-44",cat:"narrow",seats:178,range:7060,speed:840,fuelL100:834,price:14240000,maint:12120,crew:6060},
  {id:"canadair-cl-215-pompier-pax",name:"Canadair CL-215 (pompier/pax)",maker:"Canadair",fam:"Canadair CL-215",cat:"regional",seats:30,range:2400,speed:840,fuelL100:320,price:7500000,maint:4800,crew:2250},
  {id:"canadair-cl-415-bombardier-415",name:"Canadair CL-415 (Bombardier 415)",maker:"Bombardier",fam:"Canadair CL-415",cat:"regional",seats:30,range:2400,speed:840,fuelL100:320,price:7500000,maint:4800,crew:2250},
  {id:"joby-aviation-s4-evtol",name:"Joby Aviation S4 (eVTOL)",maker:"Joby Aviation",fam:"Joby Aviation",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"wisk-cora-evtol",name:"Wisk Cora (eVTOL)",maker:"Wisk Aero",fam:"Wisk Cora",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"overair-butterfly-evtol",name:"Overair Butterfly (eVTOL)",maker:"Overair",fam:"Overair Butterfly",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"airbus-cityairbus-nextgen",name:"Airbus CityAirbus NextGen",maker:"Airbus",fam:"Airbus CityAirbus",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"vertical-aerospace-vx4",name:"Vertical Aerospace VX4",maker:"Vertical Aerospace",fam:"Vertical Aerospace",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"lilium-jet-15-places-annonc",name:"Lilium Jet (15 places annoncé)",maker:"Lilium",fam:"Lilium Jet",cat:"regional",seats:16,range:1980,speed:840,fuelL100:264,price:5000000,maint:3960,crew:1900},
  {id:"archer-midnight-evtol",name:"Archer Midnight (eVTOL)",maker:"Archer Aviation",fam:"Archer Midnight",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"beta-technologies-alia-evtol",name:"Beta Technologies ALIA (eVTOL)",maker:"Beta Technologies",fam:"Beta Technologies",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"elroy-air-chaparral-cargo",name:"Elroy Air Chaparral (cargo)",maker:"Elroy Air",fam:"Elroy Air",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"xti-aircraft-trifan-600",name:"XTI Aircraft TriFan 600",maker:"XTI Aircraft",fam:"XTI Aircraft",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"opener-blackfly",name:"Opener BlackFly",maker:"Opener",fam:"Opener BlackFly",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"surair-electric-concept-regional",name:"SurAir Electric (concept regional)",maker:"SurAir",fam:"SurAir Electric",cat:"regional",seats:19,range:2070,speed:840,fuelL100:276,price:5000000,maint:4140,crew:1975},
  {id:"beechcraft-1900c",name:"Beechcraft 1900C",maker:"Beechcraft",fam:"Beechcraft 1900C",cat:"turboprop",seats:19,range:1085,speed:465,fuelL100:137,price:2000000,maint:2260,crew:1085},
  {id:"beechcraft-1900d",name:"Beechcraft 1900D",maker:"Beechcraft",fam:"Beechcraft 1900D",cat:"turboprop",seats:19,range:1085,speed:465,fuelL100:137,price:2000000,maint:2260,crew:1085},
  {id:"beechcraft-king-air-90-100-200-350",name:"Beechcraft King Air 90/100/200/350",maker:"Beechcraft",fam:"Beechcraft King",cat:"turboprop",seats:11,range:965,speed:465,fuelL100:113,price:2000000,maint:1940,crew:965},
  {id:"beechcraft-model-18-twin-beech",name:"Beechcraft Model 18 (Twin Beech)",maker:"Beechcraft",fam:"Beechcraft Model",cat:"turboprop",seats:11,range:965,speed:465,fuelL100:113,price:2000000,maint:1940,crew:965},
  {id:"piper-pa-31-navajo",name:"Piper PA-31 Navajo",maker:"Piper",fam:"Piper PA-31",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"piper-pa-31t-cheyenne",name:"Piper PA-31T Cheyenne",maker:"Piper",fam:"Piper PA-31T",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"piper-pa-42-cheyenne-iii-iv",name:"Piper PA-42 Cheyenne III/IV",maker:"Piper",fam:"Piper PA-42",cat:"regional",seats:11,range:1830,speed:840,fuelL100:244,price:5000000,maint:3660,crew:1775},
  {id:"piper-pa-46-600tp-malibu-meridian-m",name:"Piper PA-46-600TP Malibu Meridian/M600",maker:"Piper",fam:"Piper PA-46-600TP",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"swearingen-sa226-tc-metro-ii",name:"Swearingen SA226-TC Metro II",maker:"Swearingen",fam:"Swearingen SA226-TC",cat:"regional",seats:20,range:2100,speed:840,fuelL100:280,price:5000000,maint:4200,crew:2000},
  {id:"fairchild-metro-iii",name:"Fairchild Metro III",maker:"Fairchild",fam:"Fairchild Metro",cat:"regional",seats:19,range:2070,speed:840,fuelL100:276,price:5000000,maint:4140,crew:1975},
  {id:"fairchild-metro-23",name:"Fairchild Metro 23",maker:"Fairchild",fam:"Fairchild Metro",cat:"regional",seats:19,range:2070,speed:840,fuelL100:276,price:5000000,maint:4140,crew:1975},
  {id:"fairchild-fh-227",name:"Fairchild FH-227",maker:"Fairchild Hiller",fam:"Fairchild FH-227",cat:"regional",seats:52,range:3060,speed:840,fuelL100:408,price:13000000,maint:6120,crew:2800},
  {id:"iai-arava-cargo-pax",name:"IAI Arava (cargo/pax)",maker:"IAI",fam:"IAI Arava",cat:"regional",seats:20,range:2100,speed:840,fuelL100:280,price:5000000,maint:4200,crew:2000},
  {id:"iai-1124-westwind",name:"IAI 1124 Westwind",maker:"IAI",fam:"IAI 1124",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"iai-1125-astra-sp",name:"IAI 1125 Astra SP",maker:"IAI",fam:"IAI 1125",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"iai-galaxy-gulfstream-g150",name:"IAI Galaxy / Gulfstream G150",maker:"IAI",fam:"IAI Galaxy",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"tecnam-p2012-traveller",name:"Tecnam P2012 Traveller",maker:"Tecnam",fam:"Tecnam P2012",cat:"regional",seats:11,range:1830,speed:840,fuelL100:244,price:5000000,maint:3660,crew:1775},
  {id:"tecnam-p-volt-lectrique",name:"Tecnam P-Volt (électrique)",maker:"Tecnam",fam:"Tecnam P-Volt",cat:"regional",seats:19,range:2070,speed:840,fuelL100:276,price:5000000,maint:4140,crew:1975},
  {id:"piaggio-p-180-avanti",name:"Piaggio P.180 Avanti",maker:"Piaggio",fam:"Piaggio P.180",cat:"turboprop",seats:10,range:950,speed:465,fuelL100:110,price:2000000,maint:1900,crew:950},
  {id:"piaggio-p-180-avanti-ii-evo",name:"Piaggio P.180 Avanti II / EVO",maker:"Piaggio",fam:"Piaggio P.180",cat:"turboprop",seats:10,range:950,speed:465,fuelL100:110,price:2000000,maint:1900,crew:950},
  {id:"piaggio-p-166-transport-r-gional",name:"Piaggio P.166 (transport régional)",maker:"Piaggio",fam:"Piaggio P.166",cat:"regional",seats:12,range:1860,speed:840,fuelL100:248,price:5000000,maint:3720,crew:1800},
  {id:"myasishchev-m-17-m-55-concept-pax",name:"Myasishchev M-17 / M-55 (concept pax)",maker:"Myasishchev",fam:"Myasishchev M-17",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"mil-mi-38-h-lico-pax-lourd",name:"Mil Mi-38 (hélico pax lourd)",maker:"Mil",fam:"Mil Mi-38",cat:"regional",seats:30,range:2400,speed:840,fuelL100:320,price:7500000,maint:4800,crew:2250},
  {id:"kamov-ka-62-h-lico-pax",name:"Kamov Ka-62 (hélico pax)",maker:"Kamov",fam:"Kamov Ka-62",cat:"regional",seats:15,range:1950,speed:840,fuelL100:260,price:5000000,maint:3900,crew:1875},
  {id:"vaso-an-148-production-voronezh",name:"VASO An-148 (production Voronezh)",maker:"VASO",fam:"VASO An-148",cat:"regional",seats:75,range:3750,speed:840,fuelL100:500,price:18750000,maint:7500,crew:3375},
  {id:"viking-air-dhc-6-twin-otter-400",name:"Viking Air DHC-6 Twin Otter 400",maker:"Viking Air",fam:"Viking Air",cat:"turboprop",seats:19,range:1085,speed:465,fuelL100:137,price:2000000,maint:2260,crew:1085},
  {id:"let-l-610-g",name:"LET L-610 G",maker:"Let",fam:"LET L-610",cat:"regional",seats:40,range:2700,speed:840,fuelL100:360,price:10000000,maint:5400,crew:2500},
  {id:"vulcanair-p-68-observer-2",name:"Vulcanair P.68 Observer 2",maker:"Vulcanair",fam:"Vulcanair P.68",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"siai-marchetti-s-211-pax-d-riv",name:"SIAI-Marchetti S.211 (pax dérivé)",maker:"SIAI-Marchetti",fam:"SIAI-Marchetti S.211",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"wsk-pzl-104-wilga-35a-pax",name:"WSK PZL-104 Wilga 35A (pax)",maker:"WSK",fam:"WSK PZL-104",cat:"turboprop",seats:10,range:950,speed:465,fuelL100:110,price:2000000,maint:1900,crew:950},
  {id:"caiga-primus-150-chine",name:"CAIGA Primus 150 (Chine)",maker:"CAIGA",fam:"CAIGA Primus",cat:"regional",seats:19,range:2070,speed:840,fuelL100:276,price:5000000,maint:4140,crew:1975},
  {id:"kodiak-100-quest-aircraft",name:"Kodiak 100 (Quest Aircraft)",maker:"Quest Aircraft",fam:"Kodiak 100",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"kodiak-900-quest-daher",name:"Kodiak 900 (Quest/Daher)",maker:"Quest",fam:"Kodiak 900",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"dart-aerospace-concept-eturboprop",name:"DART Aerospace (concept eTurboprop)",maker:"DART Aerospace",fam:"DART Aerospace",cat:"turboprop",seats:19,range:1085,speed:465,fuelL100:137,price:2000000,maint:2260,crew:1085},
  {id:"regional-air-services-ra-1-tanzanie",name:"Regional Air Services RA-1 (Tanzanie)",maker:"Regional Air",fam:"Regional Air",cat:"regional",seats:14,range:1920,speed:840,fuelL100:256,price:5000000,maint:3840,crew:1850},
  {id:"surf-air-mobility-sbr-lectrique",name:"Surf Air Mobility (SBR électrique)",maker:"Surf Air",fam:"Surf Air",cat:"regional",seats:30,range:2400,speed:840,fuelL100:320,price:7500000,maint:4800,crew:2250},
  {id:"heron-systems-concept-autonome-pax",name:"HERON Systems (concept autonome pax)",maker:"HERON",fam:"HERON Systems",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"ravn-air-turboprop-alaska-conversio",name:"Ravn Air (turboprop Alaska conversion)",maker:"Ravn Air",fam:"Ravn Air",cat:"turboprop",seats:19,range:1085,speed:465,fuelL100:137,price:2000000,maint:2260,crew:1085},
  {id:"textron-aviation-ectm-concept",name:"Textron Aviation ECTM (concept)",maker:"Textron",fam:"Textron Aviation",cat:"regional",seats:19,range:2070,speed:840,fuelL100:276,price:5000000,maint:4140,crew:1975},
  {id:"aerojet-rocketdyne-civil-concept",name:"Aerojet Rocketdyne (civil concept)",maker:"Aerojet",fam:"Aerojet Rocketdyne",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"universal-hydrogen-dash-8-h2",name:"Universal Hydrogen (Dash 8 H2)",maker:"Universal H2",fam:"Universal Hydrogen",cat:"regional",seats:78,range:3840,speed:840,fuelL100:512,price:19500000,maint:7680,crew:3450},
  {id:"rolls-royce-accel-lectrique-record",name:"Rolls-Royce ACCEL (électrique record)",maker:"Rolls-Royce",fam:"Rolls-Royce ACCEL",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"gkn-aerospace-eturbofan-concept",name:"GKN Aerospace eTurboFan (concept)",maker:"GKN Aerospace",fam:"GKN Aerospace",cat:"narrow",seats:150,range:6500,speed:840,fuelL100:750,price:12000000,maint:11000,crew:5500},
  {id:"aura-aero-era-r-gional-lectrique",name:"AURA Aero ERA (régional électrique)",maker:"AURA Aero",fam:"AURA Aero",cat:"regional",seats:19,range:2070,speed:840,fuelL100:276,price:5000000,maint:4140,crew:1975},
  {id:"daher-ecopulse-hybride-distribu",name:"Daher EcoPulse (hybride distribué)",maker:"Daher",fam:"Daher EcoPulse",cat:"regional",seats:19,range:2070,speed:840,fuelL100:276,price:5000000,maint:4140,crew:1975},
  {id:"bristow-group-s-92-pax-offshore",name:"Bristow Group (S-92 pax offshore)",maker:"Sikorsky",fam:"Bristow Group",cat:"regional",seats:19,range:2070,speed:840,fuelL100:276,price:5000000,maint:4140,crew:1975},
  {id:"bell-525-relentless-h-lico-pax",name:"Bell 525 Relentless (hélico pax)",maker:"Bell",fam:"Bell 525",cat:"regional",seats:16,range:1980,speed:840,fuelL100:264,price:5000000,maint:3960,crew:1900},
  {id:"sikorsky-s-76d-h-lico-pax",name:"Sikorsky S-76D (hélico pax)",maker:"Sikorsky",fam:"Sikorsky S-76D",cat:"regional",seats:12,range:1860,speed:840,fuelL100:248,price:5000000,maint:3720,crew:1800},
  {id:"airbus-h175-h-lico-pax",name:"Airbus H175 (hélico pax)",maker:"Airbus Helicopters",fam:"Airbus H175",cat:"regional",seats:19,range:2070,speed:840,fuelL100:276,price:5000000,maint:4140,crew:1975},
  {id:"leonardo-aw189-h-lico-pax",name:"Leonardo AW189 (hélico pax)",maker:"Leonardo",fam:"Leonardo AW189",cat:"regional",seats:19,range:2070,speed:840,fuelL100:276,price:5000000,maint:4140,crew:1975},
  {id:"enstrom-480-pax-10",name:"Enstrom 480 (pax > 10)",maker:"Enstrom",fam:"Enstrom 480",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"a220-100-cs100",name:"A220-100 (CS100)",maker:"Airbus",fam:"A220-100 (CS100)",cat:"regional",seats:108,range:5920,speed:871,fuelL100:380,price:8100000,maint:7000,crew:2800},
  {id:"a220-300-cs300",name:"A220-300 (CS300)",maker:"Airbus",fam:"A220-300 (CS300)",cat:"narrow",seats:130,range:6300,speed:871,fuelL100:430,price:9700000,maint:8000,crew:3200},
  {id:"a220-100-acj-twotwenty",name:"A220-100 ACJ TwoTwenty",maker:"Airbus",fam:"A220-100 ACJ",cat:"regional",seats:18,range:2040,speed:840,fuelL100:272,price:5000000,maint:4080,crew:1950},
  {id:"a220-500-projet-allong",name:"A220-500 (projet allongé)",maker:"Airbus",fam:"A220-500 (projet",cat:"narrow",seats:160,range:6700,speed:840,fuelL100:780,price:12800000,maint:11400,crew:5700},
  {id:"cs100-prototype-zeroe-tude",name:"CS100 prototype ZeroE (étude)",maker:"Airbus",fam:"CS100 prototype",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"a300b1-prototype",name:"A300B1 (prototype)",maker:"Airbus",fam:"A300B1 (prototype)",cat:"wide",seats:259,range:11885,speed:880,fuelL100:2683,price:35720000,maint:17770,crew:11180},
  {id:"a300b2-100",name:"A300B2-100",maker:"Airbus",fam:"A300B2-100",cat:"wide",seats:281,range:12215,speed:880,fuelL100:2788,price:37480000,maint:18430,crew:11620},
  {id:"a300b2-200",name:"A300B2-200",maker:"Airbus",fam:"A300B2-200",cat:"wide",seats:281,range:12215,speed:880,fuelL100:2788,price:37480000,maint:18430,crew:11620},
  {id:"a300b2k-kontur",name:"A300B2K (Kontur)",maker:"Airbus",fam:"A300B2K (Kontur)",cat:"wide",seats:281,range:12215,speed:880,fuelL100:2788,price:37480000,maint:18430,crew:11620},
  {id:"a300b4-100",name:"A300B4-100",maker:"Airbus",fam:"A300B4-100",cat:"wide",seats:345,range:13175,speed:880,fuelL100:3096,price:42600000,maint:20350,crew:12900},
  {id:"a300b4-200",name:"A300B4-200",maker:"Airbus",fam:"A300B4-200",cat:"wide",seats:345,range:13175,speed:880,fuelL100:3096,price:42600000,maint:20350,crew:12900},
  {id:"a300b4-600-a300-600",name:"A300B4-600 (A300-600)",maker:"Airbus",fam:"A300B4-600 (A300-600)",cat:"wide",seats:361,range:13415,speed:880,fuelL100:3172,price:43880000,maint:20830,crew:13220},
  {id:"a300-600r",name:"A300-600R",maker:"Airbus",fam:"A300-600R",cat:"wide",seats:266,range:11990,speed:880,fuelL100:2716,price:36280000,maint:17980,crew:11320},
  {id:"a300-600f-cargo",name:"A300-600F (cargo)",maker:"Airbus",fam:"A300-600F (cargo)",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"a300b10-mc-futur-a310",name:"A300B10 MC (futur A310)",maker:"Airbus",fam:"A300B10 MC",cat:"wide",seats:230,range:11450,speed:880,fuelL100:2544,price:33400000,maint:16900,crew:10600},
  {id:"a300c4-combi",name:"A300C4 (Combi)",maker:"Airbus",fam:"A300C4 (Combi)",cat:"wide",seats:260,range:11900,speed:880,fuelL100:2688,price:35800000,maint:17800,crew:11200},
  {id:"a300-600st-beluga",name:"A300-600ST Beluga",maker:"Airbus",fam:"A300-600ST Beluga",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"a310-200",name:"A310-200",maker:"Airbus",fam:"A310-200",cat:"wide",seats:240,range:11600,speed:880,fuelL100:2592,price:34200000,maint:17200,crew:10800},
  {id:"a310-200c-combi",name:"A310-200C (Combi)",maker:"Airbus",fam:"A310-200C (Combi)",cat:"wide",seats:220,range:11300,speed:880,fuelL100:2496,price:32600000,maint:16600,crew:10400},
  {id:"a310-200f-cargo",name:"A310-200F (cargo)",maker:"Airbus",fam:"A310-200F (cargo)",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"a310-300",name:"A310-300",maker:"Airbus",fam:"A310-300",cat:"wide",seats:240,range:11600,speed:880,fuelL100:2592,price:34200000,maint:17200,crew:10800},
  {id:"a310-300f-cargo",name:"A310-300F (cargo)",maker:"Airbus",fam:"A310-300F (cargo)",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"a310-300mrtt",name:"A310-300MRTT",maker:"Airbus DS",fam:"A310-300MRTT",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"a310-400-annul",name:"A310-400 (annulé)",maker:"Airbus",fam:"A310-400 (annulé)",cat:"wide",seats:250,range:11750,speed:880,fuelL100:2640,price:35000000,maint:17500,crew:11000},
  {id:"a318-100",name:"A318-100",maker:"Airbus",fam:"A318-100",cat:"regional",seats:107,range:4710,speed:840,fuelL100:628,price:26750000,maint:9420,crew:4175},
  {id:"a318-elite-bizjet",name:"A318 Elite (bizjet)",maker:"Airbus",fam:"A318 Elite",cat:"regional",seats:18,range:2040,speed:840,fuelL100:272,price:5000000,maint:4080,crew:1950},
  {id:"a319-100",name:"A319-100",maker:"Airbus",fam:"A319-100",cat:"narrow",seats:124,range:5980,speed:840,fuelL100:873,price:9920000,maint:9960,crew:4980},
  {id:"a319-100lr-long-range",name:"A319-100LR (Long Range)",maker:"Airbus",fam:"A319-100LR (Long",cat:"regional",seats:100,range:4500,speed:840,fuelL100:600,price:25000000,maint:9000,crew:4000},
  {id:"a319neo",name:"A319neo",maker:"Airbus",fam:"A319neo",cat:"narrow",seats:120,range:5900,speed:840,fuelL100:660,price:9600000,maint:9800,crew:4900},
  {id:"acj319-corporate-jet",name:"ACJ319 (Corporate Jet)",maker:"Airbus",fam:"ACJ319 (Corporate",cat:"regional",seats:19,range:2070,speed:840,fuelL100:276,price:5000000,maint:4140,crew:1975},
  {id:"a320-100",name:"A320-100",maker:"Airbus",fam:"A320-100",cat:"narrow",seats:150,range:6500,speed:840,fuelL100:975,price:12000000,maint:11000,crew:5500},
  {id:"a320-200",name:"A320-200",maker:"Airbus",fam:"A320-200",cat:"narrow",seats:165,range:6100,speed:833,fuelL100:560,price:10600000,maint:8000,crew:3600},
  {id:"a320-200-sharklet",name:"A320-200 Sharklet",maker:"Airbus",fam:"A320-200 Sharklet",cat:"narrow",seats:165,range:6800,speed:840,fuelL100:795,price:13200000,maint:11600,crew:5800},
  {id:"a320neo-271n-271nx",name:"A320neo (271N / 271NX)",maker:"Airbus",fam:"A320neo (271N",cat:"narrow",seats:165,range:6800,speed:840,fuelL100:795,price:13200000,maint:11600,crew:5800},
  {id:"a320neo-p2f-cargo-converti",name:"A320neo P2F (cargo converti)",maker:"Airbus",fam:"A320neo P2F",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"acj320neo",name:"ACJ320neo",maker:"Airbus",fam:"ACJ320neo",cat:"regional",seats:20,range:2100,speed:840,fuelL100:280,price:5000000,maint:4200,crew:2000},
  {id:"a321-100",name:"A321-100",maker:"Airbus",fam:"A321-100",cat:"narrow",seats:185,range:7200,speed:840,fuelL100:855,price:14800000,maint:12400,crew:6200},
  {id:"a321-200",name:"A321-200",maker:"Airbus",fam:"A321-200",cat:"narrow",seats:185,range:7200,speed:840,fuelL100:855,price:14800000,maint:12400,crew:6200},
  {id:"a321neo-231n",name:"A321neo (231N)",maker:"Airbus",fam:"A321neo (231N)",cat:"narrow",seats:180,range:7100,speed:840,fuelL100:840,price:14400000,maint:12200,crew:6100},
  {id:"a321neolr-long-range",name:"A321neoLR (Long Range)",maker:"Airbus",fam:"A321neoLR (Long",cat:"narrow",seats:182,range:7140,speed:840,fuelL100:846,price:14560000,maint:12280,crew:6140},
  {id:"a321xlr-extra-long-range",name:"A321XLR (Extra Long Range)",maker:"Airbus",fam:"A321XLR (Extra",cat:"narrow",seats:180,range:7100,speed:840,fuelL100:840,price:14400000,maint:12200,crew:6100},
  {id:"acj321neo",name:"ACJ321neo",maker:"Airbus",fam:"ACJ321neo",cat:"regional",seats:25,range:2250,speed:840,fuelL100:300,price:6250000,maint:4500,crew:2125},
  {id:"a320-enhanced-pr-curseur-neo",name:"A320 Enhanced (précurseur neo)",maker:"Airbus",fam:"A320 Enhanced",cat:"narrow",seats:150,range:6500,speed:840,fuelL100:750,price:12000000,maint:11000,crew:5500},
  {id:"nsr-a30x-remplacement-futur-a320",name:"NSR / A30X (remplacement futur A320)",maker:"Airbus",fam:"NSR /",cat:"narrow",seats:170,range:6900,speed:840,fuelL100:810,price:13600000,maint:11800,crew:5900},
  {id:"a330-200",name:"A330-200",maker:"Airbus",fam:"A330-200",cat:"wide",seats:253,range:13430,speed:871,fuelL100:1750,price:24800000,maint:13000,crew:8500},
  {id:"a330-200f-cargo",name:"A330-200F (cargo)",maker:"Airbus",fam:"A330-200F (cargo)",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"a330-200-prestige-vvip",name:"A330-200 Prestige (VVIP)",maker:"Airbus",fam:"A330-200 Prestige",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"a330-300",name:"A330-300",maker:"Airbus",fam:"A330-300",cat:"wide",seats:277,range:12155,speed:880,fuelL100:2308,price:37160000,maint:18310,crew:11540},
  {id:"a330-300p2f-cargo-converti",name:"A330-300P2F (cargo converti)",maker:"Airbus",fam:"A330-300P2F (cargo",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"a330-mrtt-multi-role-tanker",name:"A330 MRTT (multi-role tanker)",maker:"Airbus DS",fam:"A330 MRTT",cat:"wide",seats:270,range:12050,speed:880,fuelL100:2280,price:36600000,maint:18100,crew:11400},
  {id:"a330-800neo",name:"A330-800neo",maker:"Airbus",fam:"A330-800neo",cat:"wide",seats:257,range:11855,speed:880,fuelL100:2228,price:35560000,maint:17710,crew:11140},
  {id:"a330-900neo",name:"A330-900neo",maker:"Airbus",fam:"A330-900neo",cat:"wide",seats:287,range:13334,speed:912,fuelL100:1850,price:30000000,maint:15000,crew:10000},
  {id:"a330neo-freighter-tude",name:"A330neo Freighter (étude)",maker:"Airbus",fam:"A330neo Freighter",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"a330-200hgw-higher-gross-weight",name:"A330-200HGW (Higher Gross Weight)",maker:"Airbus",fam:"A330-200HGW (Higher",cat:"wide",seats:253,range:11795,speed:880,fuelL100:2212,price:35240000,maint:17590,crew:11060},
  {id:"a330-700l-beluga-xl",name:"A330-700L Beluga XL",maker:"Airbus",fam:"A330-700L Beluga",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"a340-200",name:"A340-200",maker:"Airbus",fam:"A340-200",cat:"wide",seats:261,range:11915,speed:880,fuelL100:2244,price:35880000,maint:17830,crew:11220},
  {id:"a340-300",name:"A340-300",maker:"Airbus",fam:"A340-300",cat:"wide",seats:295,range:12425,speed:880,fuelL100:2380,price:38600000,maint:18850,crew:11900},
  {id:"a340-300-enhanced",name:"A340-300 Enhanced",maker:"Airbus",fam:"A340-300 Enhanced",cat:"wide",seats:295,range:12425,speed:880,fuelL100:2380,price:38600000,maint:18850,crew:11900},
  {id:"a340-300x-non-lanc",name:"A340-300X (non lancé)",maker:"Airbus",fam:"A340-300X (non",cat:"wide",seats:295,range:12425,speed:880,fuelL100:2380,price:38600000,maint:18850,crew:11900},
  {id:"a340-500",name:"A340-500",maker:"Airbus",fam:"A340-500",cat:"wide",seats:313,range:12695,speed:880,fuelL100:2452,price:40040000,maint:19390,crew:12260},
  {id:"a340-500hgw-higher-gross-weight",name:"A340-500HGW (Higher Gross Weight)",maker:"Airbus",fam:"A340-500HGW (Higher",cat:"wide",seats:313,range:12695,speed:880,fuelL100:2452,price:40040000,maint:19390,crew:12260},
  {id:"a340-600",name:"A340-600",maker:"Airbus",fam:"A340-600",cat:"wide",seats:380,range:13700,speed:880,fuelL100:2720,price:45400000,maint:21400,crew:13600},
  {id:"a340-600hgw",name:"A340-600HGW",maker:"Airbus",fam:"A340-600HGW",cat:"wide",seats:380,range:13700,speed:880,fuelL100:2720,price:45400000,maint:21400,crew:13600},
  {id:"a340-600x-700-annul",name:"A340-600X / -700 (annulé)",maker:"Airbus",fam:"A340-600X /",cat:"jumbo",seats:450,range:12250,speed:905,fuelL100:3475,price:48500000,maint:38500,crew:24000},
  {id:"a345-a346-d-signations-icao",name:"A345 / A346 (désignations ICAO)",maker:"Airbus",fam:"A345 /",cat:"wide",seats:346,range:13190,speed:880,fuelL100:2584,price:42680000,maint:20380,crew:12920},
  {id:"a350-800-annul",name:"A350-800 (annulé)",maker:"Airbus",fam:"A350-800 (annulé)",cat:"wide",seats:276,range:12140,speed:880,fuelL100:2304,price:37080000,maint:18280,crew:11520},
  {id:"a350-900",name:"A350-900",maker:"Airbus",fam:"A350-900",cat:"wide",seats:325,range:15000,speed:910,fuelL100:2100,price:35000000,maint:18000,crew:13000},
  {id:"a350-900ulr-ultra-long-range",name:"A350-900ULR (Ultra Long Range)",maker:"Airbus",fam:"A350-900ULR (Ultra",cat:"narrow",seats:161,range:6720,speed:840,fuelL100:783,price:12880000,maint:11440,crew:5720},
  {id:"a350-900f-cargo-d-di",name:"A350-900F (cargo dédié)",maker:"Airbus",fam:"A350-900F (cargo",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"a350-1000",name:"A350-1000",maker:"Airbus",fam:"A350-1000",cat:"wide",seats:369,range:16100,speed:910,fuelL100:2400,price:40000000,maint:20000,crew:15000},
  {id:"a350-1000ulr-tude",name:"A350-1000ULR (étude)",maker:"Airbus",fam:"A350-1000ULR (étude)",cat:"wide",seats:300,range:12500,speed:880,fuelL100:2400,price:39000000,maint:19000,crew:12000},
  {id:"a350-2000-concept",name:"A350-2000 (concept)",maker:"Airbus",fam:"A350-2000 (concept)",cat:"jumbo",seats:400,range:12000,speed:905,fuelL100:3400,price:47000000,maint:37000,crew:23000},
  {id:"a350-regional-concept",name:"A350 Regional (concept)",maker:"Airbus",fam:"A350 Regional",cat:"wide",seats:270,range:12050,speed:880,fuelL100:2280,price:36600000,maint:18100,crew:11400},
  {id:"a350-freighter-p2f-conversion",name:"A350 FREIGHTER P2F (conversion)",maker:"Airbus",fam:"A350 FREIGHTER",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"a3xx-tudes-1988-2000",name:"A3XX (études 1988-2000)",maker:"Airbus",fam:"A3XX (études",cat:"jumbo",seats:650,range:13250,speed:905,fuelL100:3775,price:54500000,maint:44500,crew:28000},
  {id:"a380-800",name:"A380-800",maker:"Airbus",fam:"A380-800",cat:"jumbo",seats:555,range:15200,speed:903,fuelL100:3200,price:55000000,maint:33000,crew:22000},
  {id:"a380-800f-cargo-annul",name:"A380-800F (cargo, annulé)",maker:"Airbus",fam:"A380-800F (cargo,",cat:"jumbo",seats:10,range:10050,speed:905,fuelL100:2815,price:35300000,maint:25300,crew:15200},
  {id:"a380-900-allong-annul",name:"A380-900 (allongé, annulé)",maker:"Airbus",fam:"A380-900 (allongé,",cat:"jumbo",seats:650,range:13250,speed:905,fuelL100:3775,price:54500000,maint:44500,crew:28000},
  {id:"a380-700-raccourci-annul",name:"A380-700 (raccourci, annulé)",maker:"Airbus",fam:"A380-700 (raccourci,",cat:"jumbo",seats:480,range:12400,speed:905,fuelL100:3520,price:49400000,maint:39400,crew:24600},
  {id:"a380plus-optimis",name:"A380plus (optimisé)",maker:"Airbus",fam:"A380plus (optimisé)",cat:"jumbo",seats:575,range:12875,speed:905,fuelL100:3662,price:52250000,maint:42250,crew:26500},
  {id:"a388-d-signation-icao",name:"A388 (désignation ICAO)",maker:"Airbus",fam:"A388 (désignation",cat:"jumbo",seats:555,range:12775,speed:905,fuelL100:3632,price:51650000,maint:41650,crew:26100},
  {id:"maveric-model-aircraft-for-validati",name:"MAVERIC (Model Aircraft for Validation…)",maker:"Airbus",fam:"MAVERIC (Model",cat:"narrow",seats:200,range:7500,speed:840,fuelL100:900,price:16000000,maint:13000,crew:6500},
  {id:"zeroe-turboprop-h2",name:"ZEROe Turboprop (H2)",maker:"Airbus",fam:"ZEROe Turboprop",cat:"turboprop",seats:100,range:2300,speed:510,fuelL100:380,price:9000000,maint:5500,crew:2300},
  {id:"zeroe-turbofan-h2-fuselage-classiqu",name:"ZEROe Turbofan (H2, fuselage classique)",maker:"Airbus",fam:"ZEROe Turbofan",cat:"narrow",seats:200,range:7500,speed:840,fuelL100:900,price:16000000,maint:13000,crew:6500},
  {id:"zeroe-blended-wing-body-h2",name:"ZEROe Blended Wing Body (H2)",maker:"Airbus",fam:"ZEROe Blended",cat:"narrow",seats:200,range:7500,speed:840,fuelL100:900,price:16000000,maint:13000,crew:6500},
  {id:"zeroe-d-monstrateur-a380-modifi",name:"ZEROe démonstrateur (A380 modifié)",maker:"Airbus",fam:"ZEROe démonstrateur",cat:"jumbo",seats:50,range:10250,speed:905,fuelL100:2875,price:36500000,maint:26500,crew:16000},
  {id:"zehst-zero-emission-hst-concept",name:"ZEHST (Zero Emission HST, concept)",maker:"Airbus",fam:"ZEHST (Zero",cat:"regional",seats:100,range:4500,speed:840,fuelL100:600,price:25000000,maint:9000,crew:4000},
  {id:"sugar-truss-braced-wing-nasa-airbus",name:"SUGAR Truss-Braced Wing (NASA/Airbus)",maker:"Airbus",fam:"SUGAR Truss-Braced",cat:"narrow",seats:150,range:6500,speed:840,fuelL100:750,price:12000000,maint:11000,crew:5500},
  {id:"next-generation-single-aisle-ngsa",name:"Next Generation Single Aisle (NGSA)",maker:"Airbus",fam:"Next Generation",cat:"narrow",seats:170,range:6900,speed:840,fuelL100:810,price:13600000,maint:11800,crew:5900},
  {id:"e-fan-x-d-monstrateur-hybride",name:"E-Fan X (démonstrateur hybride)",maker:"Airbus",fam:"E-Fan X",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"ecopulse-hybride-distribu",name:"EcoPulse (hybride distribué)",maker:"Airbus",fam:"EcoPulse (hybride",cat:"regional",seats:19,range:2070,speed:840,fuelL100:276,price:5000000,maint:4140,crew:1975},
  {id:"367-80-dash-80-proto",name:"367-80 (Dash-80, proto)",maker:"Boeing",fam:"367-80 (Dash-80,",cat:"turboprop",seats:50,range:1550,speed:485,fuelL100:230,price:4500000,maint:3500,crew:1550},
  {id:"707-020-707-120",name:"707-020 (707-120)",maker:"Boeing",fam:"707-020 (707-120)",cat:"narrow",seats:179,range:7080,speed:840,fuelL100:1339,price:14320000,maint:12160,crew:6080},
  {id:"707-120b",name:"707-120B",maker:"Boeing",fam:"707-120B",cat:"narrow",seats:179,range:7080,speed:840,fuelL100:1339,price:14320000,maint:12160,crew:6080},
  {id:"707-138-qantas",name:"707-138 (Qantas)",maker:"Boeing",fam:"707-138 (Qantas)",cat:"narrow",seats:143,range:6360,speed:840,fuelL100:1166,price:11440000,maint:10720,crew:5360},
  {id:"707-220",name:"707-220",maker:"Boeing",fam:"707-220",cat:"narrow",seats:179,range:7080,speed:840,fuelL100:1339,price:14320000,maint:12160,crew:6080},
  {id:"707-320-intercontinental",name:"707-320 (Intercontinental)",maker:"Boeing",fam:"707-320 (Intercontinental)",cat:"narrow",seats:189,range:7280,speed:840,fuelL100:1387,price:15120000,maint:12560,crew:6280},
  {id:"707-320b",name:"707-320B",maker:"Boeing",fam:"707-320B",cat:"narrow",seats:189,range:7280,speed:840,fuelL100:1387,price:15120000,maint:12560,crew:6280},
  {id:"707-320c-convertible",name:"707-320C (Convertible)",maker:"Boeing",fam:"707-320C (Convertible)",cat:"narrow",seats:219,range:7880,speed:840,fuelL100:1531,price:17520000,maint:13760,crew:6880},
  {id:"707-420",name:"707-420",maker:"Boeing",fam:"707-420",cat:"narrow",seats:189,range:7280,speed:840,fuelL100:1387,price:15120000,maint:12560,crew:6280},
  {id:"720-707-020",name:"720 (707-020)",maker:"Boeing",fam:"720 (707-020)",cat:"narrow",seats:149,range:6480,speed:840,fuelL100:1195,price:11920000,maint:10960,crew:5480},
  {id:"720b",name:"720B",maker:"Boeing",fam:"720B",cat:"narrow",seats:149,range:6480,speed:840,fuelL100:1195,price:11920000,maint:10960,crew:5480},
  {id:"717-200",name:"717-200",maker:"Boeing",fam:"717-200",cat:"narrow",seats:117,range:5840,speed:840,fuelL100:651,price:9360000,maint:9680,crew:4840},
  {id:"717-100x-annul",name:"717-100X (annulé)",maker:"Boeing",fam:"717-100X (annulé)",cat:"regional",seats:80,range:3900,speed:840,fuelL100:520,price:20000000,maint:7800,crew:3500},
  {id:"717-300x-annul",name:"717-300X (annulé)",maker:"Boeing",fam:"717-300X (annulé)",cat:"narrow",seats:130,range:6100,speed:840,fuelL100:690,price:10400000,maint:10200,crew:5100},
  {id:"727-100",name:"727-100",maker:"Boeing",fam:"727-100",cat:"narrow",seats:131,range:6120,speed:840,fuelL100:1108,price:10480000,maint:10240,crew:5120},
  {id:"727-100c-combi",name:"727-100C (Combi)",maker:"Boeing",fam:"727-100C (Combi)",cat:"narrow",seats:131,range:6120,speed:840,fuelL100:1108,price:10480000,maint:10240,crew:5120},
  {id:"727-100qc-quick-change",name:"727-100QC (Quick Change)",maker:"Boeing",fam:"727-100QC (Quick",cat:"narrow",seats:131,range:6120,speed:840,fuelL100:1108,price:10480000,maint:10240,crew:5120},
  {id:"727-200",name:"727-200",maker:"Boeing",fam:"727-200",cat:"narrow",seats:163,range:6760,speed:840,fuelL100:1262,price:13040000,maint:11520,crew:5760},
  {id:"727-200-advanced",name:"727-200 Advanced",maker:"Boeing",fam:"727-200 Advanced",cat:"narrow",seats:163,range:6760,speed:840,fuelL100:1262,price:13040000,maint:11520,crew:5760},
  {id:"727-200f-cargo",name:"727-200F (cargo)",maker:"Boeing",fam:"727-200F (cargo)",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"737-100",name:"737-100",maker:"Boeing",fam:"737-100",cat:"narrow",seats:110,range:5700,speed:840,fuelL100:630,price:8800000,maint:9400,crew:4700},
  {id:"737-200",name:"737-200",maker:"Boeing",fam:"737-200",cat:"narrow",seats:122,range:5940,speed:840,fuelL100:865,price:9760000,maint:9880,crew:4940},
  {id:"737-200-advanced",name:"737-200 Advanced",maker:"Boeing",fam:"737-200 Advanced",cat:"narrow",seats:130,range:6100,speed:840,fuelL100:897,price:10400000,maint:10200,crew:5100},
  {id:"737-200c-convertible",name:"737-200C (Convertible)",maker:"Boeing",fam:"737-200C (Convertible)",cat:"narrow",seats:130,range:6100,speed:840,fuelL100:897,price:10400000,maint:10200,crew:5100},
  {id:"737-200qc-quick-change",name:"737-200QC (Quick Change)",maker:"Boeing",fam:"737-200QC (Quick",cat:"narrow",seats:130,range:6100,speed:840,fuelL100:897,price:10400000,maint:10200,crew:5100},
  {id:"737-200-advanced-stol-option",name:"737-200 Advanced (STOL option)",maker:"Boeing",fam:"737-200 Advanced",cat:"narrow",seats:130,range:6100,speed:840,fuelL100:897,price:10400000,maint:10200,crew:5100},
  {id:"t-43a-usaf-nav-trainer",name:"T-43A (USAF nav. trainer)",maker:"Boeing",fam:"T-43A (USAF",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"737-300",name:"737-300",maker:"Boeing",fam:"737-300",cat:"narrow",seats:138,range:6260,speed:840,fuelL100:928,price:11040000,maint:10520,crew:5260},
  {id:"737-300-winglets-sp",name:"737-300 Winglets (SP)",maker:"Boeing",fam:"737-300 Winglets",cat:"narrow",seats:149,range:6480,speed:840,fuelL100:971,price:11920000,maint:10960,crew:5480},
  {id:"737-300f-cargo-converti",name:"737-300F (cargo converti)",maker:"Boeing",fam:"737-300F (cargo",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"737-400",name:"737-400",maker:"Boeing",fam:"737-400",cat:"narrow",seats:167,range:6840,speed:840,fuelL100:1041,price:13360000,maint:11680,crew:5840},
  {id:"737-400-combi",name:"737-400 Combi",maker:"Boeing",fam:"737-400 Combi",cat:"narrow",seats:146,range:6420,speed:840,fuelL100:959,price:11680000,maint:10840,crew:5420},
  {id:"737-500",name:"737-500",maker:"Boeing",fam:"737-500",cat:"narrow",seats:120,range:5900,speed:840,fuelL100:858,price:9600000,maint:9800,crew:4900},
  {id:"737-500-sp-winglets",name:"737-500 SP (Winglets)",maker:"Boeing",fam:"737-500 SP",cat:"narrow",seats:132,range:6140,speed:840,fuelL100:904,price:10560000,maint:10280,crew:5140},
  {id:"737-600",name:"737-600",maker:"Boeing",fam:"737-600",cat:"narrow",seats:121,range:5920,speed:840,fuelL100:663,price:9680000,maint:9840,crew:4920},
  {id:"737-700",name:"737-700",maker:"Boeing",fam:"737-700",cat:"narrow",seats:137,range:6240,speed:840,fuelL100:711,price:10960000,maint:10480,crew:5240},
  {id:"737-700er-extended-range",name:"737-700ER (Extended Range)",maker:"Boeing",fam:"737-700ER (Extended",cat:"narrow",seats:126,range:6020,speed:840,fuelL100:678,price:10080000,maint:10040,crew:5020},
  {id:"737-700c-combi-convertible",name:"737-700C (Combi/Convertible)",maker:"Boeing",fam:"737-700C (Combi/Convertible)",cat:"narrow",seats:149,range:6480,speed:840,fuelL100:747,price:11920000,maint:10960,crew:5480},
  {id:"bbj1-business-jet-1",name:"BBJ1 (Business Jet 1)",maker:"Boeing",fam:"BBJ1 (Business",cat:"regional",seats:25,range:2250,speed:840,fuelL100:300,price:6250000,maint:4500,crew:2125},
  {id:"737-800",name:"737-800",maker:"Boeing",fam:"737-800",cat:"narrow",seats:175,range:7000,speed:840,fuelL100:825,price:14000000,maint:12000,crew:6000},
  {id:"737-800bcf-cargo-converted-freighte",name:"737-800BCF (Cargo Converted Freighter)",maker:"Boeing",fam:"737-800BCF (Cargo",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"737-800bdsf-bedek-special-freighter",name:"737-800BDSF (Bedek Special Freighter)",maker:"Boeing",fam:"737-800BDSF (Bedek",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"737-800sf-special-freighter-aei",name:"737-800SF (Special Freighter, AEI)",maker:"Boeing",fam:"737-800SF (Special",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"bbj2-business-jet-2",name:"BBJ2 (Business Jet 2)",maker:"Boeing",fam:"BBJ2 (Business",cat:"regional",seats:25,range:2250,speed:840,fuelL100:300,price:6250000,maint:4500,crew:2125},
  {id:"737-900",name:"737-900",maker:"Boeing",fam:"737-900",cat:"narrow",seats:177,range:7040,speed:840,fuelL100:831,price:14160000,maint:12080,crew:6040},
  {id:"737-900er-extended-range",name:"737-900ER (Extended Range)",maker:"Boeing",fam:"737-900ER (Extended",cat:"narrow",seats:198,range:7460,speed:840,fuelL100:894,price:15840000,maint:12920,crew:6460},
  {id:"bbj3-business-jet-3",name:"BBJ3 (Business Jet 3)",maker:"Boeing",fam:"BBJ3 (Business",cat:"regional",seats:25,range:2250,speed:840,fuelL100:300,price:6250000,maint:4500,crew:2125},
  {id:"737-max-7",name:"737 MAX 7",maker:"Boeing",fam:"737 MAX",cat:"narrow",seats:145,range:6400,speed:840,fuelL100:735,price:11600000,maint:10800,crew:5400},
  {id:"737-max-8",name:"737 MAX 8",maker:"Boeing",fam:"737 MAX",cat:"narrow",seats:170,range:6900,speed:840,fuelL100:810,price:13600000,maint:11800,crew:5900},
  {id:"737-max-8-200-haute-densit",name:"737 MAX 8-200 (haute densité)",maker:"Boeing",fam:"737 MAX",cat:"narrow",seats:203,range:7560,speed:840,fuelL100:909,price:16240000,maint:13120,crew:6560},
  {id:"737-max-9",name:"737 MAX 9",maker:"Boeing",fam:"737 MAX",cat:"narrow",seats:199,range:7480,speed:840,fuelL100:897,price:15920000,maint:12960,crew:6480},
  {id:"737-max-10",name:"737 MAX 10",maker:"Boeing",fam:"737 MAX",cat:"narrow",seats:209,range:7680,speed:840,fuelL100:927,price:16720000,maint:13360,crew:6680},
  {id:"bbj-max-7-business-jet",name:"BBJ MAX 7 (Business Jet)",maker:"Boeing",fam:"BBJ MAX",cat:"regional",seats:25,range:2250,speed:840,fuelL100:300,price:6250000,maint:4500,crew:2125},
  {id:"bbj-max-8",name:"BBJ MAX 8",maker:"Boeing",fam:"BBJ MAX",cat:"regional",seats:25,range:2250,speed:840,fuelL100:300,price:6250000,maint:4500,crew:2125},
  {id:"bbj-max-9",name:"BBJ MAX 9",maker:"Boeing",fam:"BBJ MAX",cat:"regional",seats:25,range:2250,speed:840,fuelL100:300,price:6250000,maint:4500,crew:2125},
  {id:"737-max-7-200-haute-densit",name:"737 MAX 7-200 (haute densité)",maker:"Boeing",fam:"737 MAX",cat:"narrow",seats:153,range:6560,speed:840,fuelL100:759,price:12240000,maint:11120,crew:5560},
  {id:"747-100",name:"747-100",maker:"Boeing",fam:"747-100",cat:"jumbo",seats:428,range:12140,speed:905,fuelL100:3442,price:47840000,maint:37840,crew:23560},
  {id:"747-100b",name:"747-100B",maker:"Boeing",fam:"747-100B",cat:"jumbo",seats:366,range:11830,speed:905,fuelL100:3349,price:45980000,maint:35980,crew:22320},
  {id:"747-100sr-short-range",name:"747-100SR (Short Range)",maker:"Boeing",fam:"747-100SR (Short",cat:"jumbo",seats:498,range:12490,speed:905,fuelL100:3547,price:49940000,maint:39940,crew:24960},
  {id:"747-100bsud-upper-deck",name:"747-100BSUD (Upper Deck)",maker:"Boeing",fam:"747-100BSUD (Upper",cat:"jumbo",seats:366,range:11830,speed:905,fuelL100:3349,price:45980000,maint:35980,crew:22320},
  {id:"747-200b",name:"747-200B",maker:"Boeing",fam:"747-200B",cat:"jumbo",seats:452,range:12260,speed:905,fuelL100:3478,price:48560000,maint:38560,crew:24040},
  {id:"747-200c-convertible",name:"747-200C (Convertible)",maker:"Boeing",fam:"747-200C (Convertible)",cat:"jumbo",seats:452,range:12260,speed:905,fuelL100:3478,price:48560000,maint:38560,crew:24040},
  {id:"747-200f-freighter",name:"747-200F (Freighter)",maker:"Boeing",fam:"747-200F (Freighter)",cat:"jumbo",seats:10,range:10050,speed:905,fuelL100:2815,price:35300000,maint:25300,crew:15200},
  {id:"747-200m-combi",name:"747-200M (Combi)",maker:"Boeing",fam:"747-200M (Combi)",cat:"jumbo",seats:452,range:12260,speed:905,fuelL100:3478,price:48560000,maint:38560,crew:24040},
  {id:"747sp-special-performance",name:"747SP (Special Performance)",maker:"Boeing",fam:"747SP (Special",cat:"wide",seats:378,range:13670,speed:880,fuelL100:2712,price:45240000,maint:21340,crew:13560},
  {id:"747-300",name:"747-300",maker:"Boeing",fam:"747-300",cat:"jumbo",seats:512,range:12560,speed:905,fuelL100:3568,price:50360000,maint:40360,crew:25240},
  {id:"747-300m-combi",name:"747-300M (Combi)",maker:"Boeing",fam:"747-300M (Combi)",cat:"jumbo",seats:400,range:12000,speed:905,fuelL100:3400,price:47000000,maint:37000,crew:23000},
  {id:"747-300sr",name:"747-300SR",maker:"Boeing",fam:"747-300SR",cat:"jumbo",seats:568,range:12840,speed:905,fuelL100:3652,price:52040000,maint:42040,crew:26360},
  {id:"747-400",name:"747-400",maker:"Boeing",fam:"747-400",cat:"jumbo",seats:538,range:12690,speed:905,fuelL100:3607,price:51140000,maint:41140,crew:25760},
  {id:"747-400d-domestic",name:"747-400D (Domestic)",maker:"Boeing",fam:"747-400D (Domestic)",cat:"jumbo",seats:596,range:12980,speed:905,fuelL100:3694,price:52880000,maint:42880,crew:26920},
  {id:"747-400er-extended-range",name:"747-400ER (Extended Range)",maker:"Boeing",fam:"747-400ER (Extended",cat:"jumbo",seats:416,range:12080,speed:905,fuelL100:3424,price:47480000,maint:37480,crew:23320},
  {id:"747-400erf-cargo",name:"747-400ERF (cargo)",maker:"Boeing",fam:"747-400ERF (cargo)",cat:"jumbo",seats:10,range:10050,speed:905,fuelL100:2815,price:35300000,maint:25300,crew:15200},
  {id:"747-400f-cargo",name:"747-400F (cargo)",maker:"Boeing",fam:"747-400F (cargo)",cat:"jumbo",seats:10,range:10050,speed:905,fuelL100:2815,price:35300000,maint:25300,crew:15200},
  {id:"747-400m-combi",name:"747-400M (Combi)",maker:"Boeing",fam:"747-400M (Combi)",cat:"jumbo",seats:416,range:12080,speed:905,fuelL100:3424,price:47480000,maint:37480,crew:23320},
  {id:"747-400-bcf-cargo-converted",name:"747-400 BCF (Cargo Converted)",maker:"Boeing",fam:"747-400 BCF",cat:"jumbo",seats:10,range:10050,speed:905,fuelL100:2815,price:35300000,maint:25300,crew:15200},
  {id:"747-400bdsf-iai-conversion",name:"747-400BDSF (IAI conversion)",maker:"Boeing",fam:"747-400BDSF (IAI",cat:"jumbo",seats:50,range:10250,speed:905,fuelL100:2875,price:36500000,maint:26500,crew:16000},
  {id:"747x-annul-version-747-400-stretch",name:"747X (annulé, version 747-400 stretch)",maker:"Boeing",fam:"747X (annulé,",cat:"jumbo",seats:430,range:12150,speed:905,fuelL100:3445,price:47900000,maint:37900,crew:23600},
  {id:"747x-stretch-annul",name:"747X Stretch (annulé)",maker:"Boeing",fam:"747X Stretch",cat:"jumbo",seats:500,range:12500,speed:905,fuelL100:3550,price:50000000,maint:40000,crew:25000},
  {id:"747-500x-annul-1996",name:"747-500X (annulé, 1996)",maker:"Boeing",fam:"747-500X (annulé,",cat:"jumbo",seats:462,range:12310,speed:905,fuelL100:3493,price:48860000,maint:38860,crew:24240},
  {id:"747-600x-annul-1996",name:"747-600X (annulé, 1996)",maker:"Boeing",fam:"747-600X (annulé,",cat:"jumbo",seats:548,range:12740,speed:905,fuelL100:3622,price:51440000,maint:41440,crew:25960},
  {id:"747asb-advanced-short-body-concept",name:"747ASB (Advanced Short Body, concept)",maker:"Boeing",fam:"747ASB (Advanced",cat:"wide",seats:300,range:12500,speed:880,fuelL100:2400,price:39000000,maint:19000,crew:12000},
  {id:"747-trir-acteur-concept-1970s",name:"747 triréacteur (concept 1970s)",maker:"Boeing",fam:"747 triréacteur",cat:"jumbo",seats:450,range:12250,speed:905,fuelL100:3475,price:48500000,maint:38500,crew:24000},
  {id:"747-8i-intercontinental",name:"747-8I (Intercontinental)",maker:"Boeing",fam:"747-8I (Intercontinental)",cat:"jumbo",seats:467,range:12335,speed:905,fuelL100:3500,price:49010000,maint:39010,crew:24340},
  {id:"747-8f-freighter",name:"747-8F (Freighter)",maker:"Boeing",fam:"747-8F (Freighter)",cat:"jumbo",seats:10,range:10050,speed:905,fuelL100:2815,price:35300000,maint:25300,crew:15200},
  {id:"747-8-combi-tude",name:"747-8 Combi (étude)",maker:"Boeing",fam:"747-8 Combi",cat:"jumbo",seats:400,range:12000,speed:905,fuelL100:3400,price:47000000,maint:37000,crew:23000},
  {id:"super-clipper-3-fuselages-concept-1",name:"Super Clipper (3 fuselages, concept 1930s)",maker:"Boeing",fam:"Super Clipper",cat:"jumbo",seats:1000,range:15000,speed:905,fuelL100:4300,price:65000000,maint:55000,crew:35000},
  {id:"757-200",name:"757-200",maker:"Boeing",fam:"757-200",cat:"narrow",seats:207,range:7640,speed:840,fuelL100:1197,price:16560000,maint:13280,crew:6640},
  {id:"757-200m-combi",name:"757-200M (Combi)",maker:"Boeing",fam:"757-200M (Combi)",cat:"wide",seats:228,range:11420,speed:880,fuelL100:2534,price:33240000,maint:16840,crew:10560},
  {id:"757-200sf-cargo-converti",name:"757-200SF (cargo converti)",maker:"Boeing",fam:"757-200SF (cargo",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"757-200pf-package-freighter",name:"757-200PF (Package Freighter)",maker:"Boeing",fam:"757-200PF (Package",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"757-300",name:"757-300",maker:"Boeing",fam:"757-300",cat:"wide",seats:269,range:12035,speed:880,fuelL100:2731,price:36520000,maint:18070,crew:11380},
  {id:"bbj-757-bizjet",name:"BBJ 757 (bizjet)",maker:"Boeing",fam:"BBJ 757",cat:"regional",seats:40,range:2700,speed:840,fuelL100:360,price:10000000,maint:5400,crew:2500},
  {id:"757-400-annul",name:"757-400 (annulé)",maker:"Boeing",fam:"757-400 (annulé)",cat:"wide",seats:300,range:12500,speed:880,fuelL100:2880,price:39000000,maint:19000,crew:12000},
  {id:"nma-797-middle-of-market-2010s",name:"NMA/797 (Middle of Market, 2010s)",maker:"Boeing",fam:"NMA/797 (Middle",cat:"wide",seats:245,range:11675,speed:880,fuelL100:2180,price:34600000,maint:17350,crew:10900},
  {id:"767-200",name:"767-200",maker:"Boeing",fam:"767-200",cat:"narrow",seats:198,range:7460,speed:840,fuelL100:1162,price:15840000,maint:12920,crew:6460},
  {id:"767-200er-extended-range",name:"767-200ER (Extended Range)",maker:"Boeing",fam:"767-200ER (Extended",cat:"narrow",seats:198,range:7460,speed:840,fuelL100:1162,price:15840000,maint:12920,crew:6460},
  {id:"767-200lr-long-range-annul",name:"767-200LR (Long Range, annulé)",maker:"Boeing",fam:"767-200LR (Long",cat:"narrow",seats:181,range:7120,speed:840,fuelL100:1095,price:14480000,maint:12240,crew:6120},
  {id:"767-300",name:"767-300",maker:"Boeing",fam:"767-300",cat:"wide",seats:243,range:11645,speed:880,fuelL100:2606,price:34440000,maint:17290,crew:10860},
  {id:"767-300er",name:"767-300ER",maker:"Boeing",fam:"767-300ER",cat:"wide",seats:243,range:11645,speed:880,fuelL100:2606,price:34440000,maint:17290,crew:10860},
  {id:"767-300f-freighter",name:"767-300F (Freighter)",maker:"Boeing",fam:"767-300F (Freighter)",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"767-300bcf-cargo-converti",name:"767-300BCF (cargo converti)",maker:"Boeing",fam:"767-300BCF (cargo",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"767-400er",name:"767-400ER",maker:"Boeing",fam:"767-400ER",cat:"wide",seats:274,range:12110,speed:880,fuelL100:2755,price:36920000,maint:18220,crew:11480},
  {id:"767-400erx-annul",name:"767-400ERX (annulé)",maker:"Boeing",fam:"767-400ERX (annulé)",cat:"wide",seats:350,range:13250,speed:880,fuelL100:3120,price:43000000,maint:20500,crew:13000},
  {id:"767-freighter-ng-tanker-kc-46",name:"767 Freighter NG (Tanker KC-46)",maker:"Boeing",fam:"767 Freighter",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"777-200",name:"777-200",maker:"Boeing",fam:"777-200",cat:"wide",seats:372,range:13580,speed:880,fuelL100:2688,price:44760000,maint:21160,crew:13440},
  {id:"777-200er-extended-range",name:"777-200ER (Extended Range)",maker:"Boeing",fam:"777-200ER (Extended",cat:"wide",seats:305,range:12575,speed:880,fuelL100:2420,price:39400000,maint:19150,crew:12100},
  {id:"777-200lr-longer-range",name:"777-200LR (Longer Range)",maker:"Boeing",fam:"777-200LR (Longer",cat:"wide",seats:305,range:12575,speed:880,fuelL100:2420,price:39400000,maint:19150,crew:12100},
  {id:"777f-freighter",name:"777F (Freighter)",maker:"Boeing",fam:"777F (Freighter)",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"777-300",name:"777-300",maker:"Boeing",fam:"777-300",cat:"jumbo",seats:459,range:12295,speed:905,fuelL100:3488,price:48770000,maint:38770,crew:24180},
  {id:"777-300er-extended-range",name:"777-300ER (Extended Range)",maker:"Boeing",fam:"777-300ER (Extended",cat:"jumbo",seats:473,range:12365,speed:905,fuelL100:3509,price:49190000,maint:39190,crew:24460},
  {id:"777x-9-777-9",name:"777X-9 (777-9)",maker:"Boeing",fam:"777X-9 (777-9)",cat:"jumbo",seats:426,range:12130,speed:905,fuelL100:3439,price:47780000,maint:37780,crew:23520},
  {id:"777x-8-777-8",name:"777X-8 (777-8)",maker:"Boeing",fam:"777X-8 (777-8)",cat:"wide",seats:384,range:13760,speed:880,fuelL100:2736,price:45720000,maint:21520,crew:13680},
  {id:"777x-8f-777-8-freighter",name:"777X-8F (777-8 Freighter)",maker:"Boeing",fam:"777X-8F (777-8",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"777-200lrx-tude-annul-e",name:"777-200LRX (étude, annulée)",maker:"Boeing",fam:"777-200LRX (étude,",cat:"wide",seats:300,range:12500,speed:880,fuelL100:2400,price:39000000,maint:19000,crew:12000},
  {id:"777-300erlt-long-thin-concept",name:"777-300ERLT (Long Thin concept)",maker:"Boeing",fam:"777-300ERLT (Long",cat:"wide",seats:300,range:12500,speed:880,fuelL100:2400,price:39000000,maint:19000,crew:12000},
  {id:"777x-10-projet",name:"777X-10 (projet)",maker:"Boeing",fam:"777X-10 (projet)",cat:"jumbo",seats:500,range:12500,speed:905,fuelL100:3550,price:50000000,maint:40000,crew:25000},
  {id:"7e7-tudes-initiales-2001-2003",name:"7E7 (études initiales 2001-2003)",maker:"Boeing",fam:"7E7 (études",cat:"wide",seats:250,range:11750,speed:880,fuelL100:2200,price:35000000,maint:17500,crew:11000},
  {id:"787-3-annul",name:"787-3 (annulé)",maker:"Boeing",fam:"787-3 (annulé)",cat:"wide",seats:296,range:12440,speed:880,fuelL100:2384,price:38680000,maint:18880,crew:11920},
  {id:"787-8",name:"787-8",maker:"Boeing",fam:"787-8",cat:"wide",seats:311,range:12665,speed:880,fuelL100:2444,price:39880000,maint:19330,crew:12220},
  {id:"787-9",name:"787-9",maker:"Boeing",fam:"787-9",cat:"wide",seats:358,range:13370,speed:880,fuelL100:2632,price:43640000,maint:20740,crew:13160},
  {id:"787-10",name:"787-10",maker:"Boeing",fam:"787-10",cat:"wide",seats:385,range:13775,speed:880,fuelL100:2740,price:45800000,maint:21550,crew:13700},
  {id:"787-12-concept-allong",name:"787-12 (concept allongé)",maker:"Boeing",fam:"787-12 (concept",cat:"wide",seats:380,range:13700,speed:880,fuelL100:2720,price:45400000,maint:21400,crew:13600},
  {id:"boeing-2707-200-sst-swing-wing",name:"Boeing 2707-200 (SST swing-wing)",maker:"Boeing",fam:"Boeing 2707-200",cat:"supersonic",seats:300,range:9000,speed:2100,fuelL100:7500,price:150000000,maint:110000,crew:45000},
  {id:"boeing-2707-300-sst-fixed-wing",name:"Boeing 2707-300 (SST fixed-wing)",maker:"Boeing",fam:"Boeing 2707-300",cat:"supersonic",seats:234,range:8340,speed:2100,fuelL100:5850,price:150000000,maint:96800,crew:38400},
  {id:"boeing-2707-100-sst-proto",name:"Boeing 2707-100 (SST proto)",maker:"Boeing",fam:"Boeing 2707-100",cat:"supersonic",seats:277,range:8770,speed:2100,fuelL100:6925,price:150000000,maint:105400,crew:42700},
  {id:"sonic-cruiser-mach-0-98",name:"Sonic Cruiser (Mach 0.98)",maker:"Boeing",fam:"Sonic Cruiser",cat:"supersonic",seats:250,range:8500,speed:2100,fuelL100:6250,price:150000000,maint:100000,crew:40000},
  {id:"boeing-7j7-udf-propfan-1980s",name:"Boeing 7J7 (UDF/Propfan 1980s)",maker:"Boeing",fam:"Boeing 7J7",cat:"narrow",seats:150,range:6500,speed:840,fuelL100:750,price:12000000,maint:11000,crew:5500},
  {id:"yellowstone-y1-737-replacement",name:"Yellowstone Y1 (737 replacement)",maker:"Boeing",fam:"Yellowstone Y1",cat:"narrow",seats:170,range:6900,speed:840,fuelL100:810,price:13600000,maint:11800,crew:5900},
  {id:"yellowstone-y2-787",name:"Yellowstone Y2 (787)",maker:"Boeing",fam:"Yellowstone Y2",cat:"wide",seats:250,range:11750,speed:880,fuelL100:2200,price:35000000,maint:17500,crew:11000},
  {id:"yellowstone-y3-777x",name:"Yellowstone Y3 (777X)",maker:"Boeing",fam:"Yellowstone Y3",cat:"jumbo",seats:400,range:12000,speed:905,fuelL100:3400,price:47000000,maint:37000,crew:23000},
  {id:"nma-new-midmarket-airplane-797",name:"NMA (New Midmarket Airplane/797)",maker:"Boeing",fam:"NMA (New",cat:"wide",seats:247,range:11705,speed:880,fuelL100:2188,price:34760000,maint:17410,crew:10940},
  {id:"boeing-pelican-cargo-wig",name:"Boeing Pelican (cargo WIG)",maker:"Boeing",fam:"Boeing Pelican",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"boeing-759-159-distributed-load",name:"Boeing 759-159 (distributed load)",maker:"Boeing",fam:"Boeing 759-159",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"model-326-flying-boat-double-deck",name:"Model 326 (flying boat double-deck)",maker:"Boeing",fam:"Model 326",cat:"regional",seats:100,range:4500,speed:840,fuelL100:600,price:25000000,maint:9000,crew:4000},
  {id:"ttbw-truss-braced-wing-nasa",name:"TTBW (Truss-Braced Wing NASA)",maker:"Boeing",fam:"TTBW (Truss-Braced",cat:"narrow",seats:150,range:6500,speed:840,fuelL100:750,price:12000000,maint:11000,crew:5500},
  {id:"arj21-700-c909-700",name:"ARJ21-700 (C909-700)",maker:"COMAC",fam:"ARJ21-700 (C909-700)",cat:"regional",seats:84,range:4020,speed:840,fuelL100:536,price:21000000,maint:8040,crew:3600},
  {id:"arj21-700er-extended-range",name:"ARJ21-700ER (Extended Range)",maker:"COMAC",fam:"ARJ21-700ER (Extended",cat:"regional",seats:78,range:3840,speed:840,fuelL100:512,price:19500000,maint:7680,crew:3450},
  {id:"arj21-900-c909-900-allong",name:"ARJ21-900 (C909-900, allongé)",maker:"COMAC",fam:"ARJ21-900 (C909-900,",cat:"regional",seats:101,range:4530,speed:840,fuelL100:604,price:25250000,maint:9060,crew:4025},
  {id:"arj21-f-c909f-cargo",name:"ARJ21-F / C909F (cargo)",maker:"COMAC",fam:"ARJ21-F /",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"arj21-7b-acj21-bizjet",name:"ARJ21-7B / ACJ21 (bizjet)",maker:"COMAC",fam:"ARJ21-7B /",cat:"regional",seats:20,range:2100,speed:840,fuelL100:280,price:5000000,maint:4200,crew:2000},
  {id:"c909-transnusa-export-indon-sie",name:"C909 TransNusa (export Indonésie)",maker:"COMAC",fam:"C909 TransNusa",cat:"regional",seats:90,range:4200,speed:840,fuelL100:560,price:22500000,maint:8400,crew:3750},
  {id:"c919-version-standard",name:"C919 (version standard)",maker:"COMAC",fam:"C919 (version",cat:"narrow",seats:158,range:5555,speed:834,fuelL100:560,price:50000000,maint:10000,crew:4200},
  {id:"c919-extended-range",name:"C919 Extended Range",maker:"COMAC",fam:"C919 Extended",cat:"narrow",seats:158,range:6660,speed:840,fuelL100:774,price:12640000,maint:11320,crew:5660},
  {id:"c919-plateau-version-raccourci",name:"C919 Plateau Version (raccourci)",maker:"COMAC",fam:"C919 Plateau",cat:"narrow",seats:140,range:6300,speed:840,fuelL100:720,price:11200000,maint:10600,crew:5300},
  {id:"c919-stretched-210-places",name:"C919 Stretched (210 places)",maker:"COMAC",fam:"C919 Stretched",cat:"narrow",seats:210,range:7700,speed:840,fuelL100:930,price:16800000,maint:13400,crew:6700},
  {id:"c919f-cargo-projet",name:"C919F (cargo, projet)",maker:"COMAC",fam:"C919F (cargo,",cat:"regional",seats:10,range:1800,speed:840,fuelL100:240,price:5000000,maint:3600,crew:1750},
  {id:"c919-easa-certification-en-cours",name:"C919 EASA certification (en cours)",maker:"COMAC",fam:"C919 EASA",cat:"narrow",seats:168,range:6860,speed:840,fuelL100:804,price:13440000,maint:11720,crew:5860},
  {id:"cr929-craic-sino-russe-2015-2022",name:"CR929 (CRAIC sino-russe, 2015-2022)",maker:"COMAC",fam:"CR929 (CRAIC",cat:"wide",seats:285,range:12275,speed:880,fuelL100:2340,price:37800000,maint:18550,crew:11700},
  {id:"c929-500",name:"C929-500",maker:"COMAC",fam:"C929-500",cat:"wide",seats:250,range:11750,speed:880,fuelL100:2200,price:35000000,maint:17500,crew:11000},
  {id:"c929-600",name:"C929-600",maker:"COMAC",fam:"C929-600",cat:"wide",seats:280,range:12200,speed:880,fuelL100:2320,price:37400000,maint:18400,crew:11600},
  {id:"c929-700",name:"C929-700",maker:"COMAC",fam:"C929-700",cat:"wide",seats:320,range:12800,speed:880,fuelL100:2480,price:40600000,maint:19600,crew:12400},
  {id:"c929-bizjet-acj929-concept",name:"C929 bizjet (ACJ929, concept)",maker:"COMAC",fam:"C929 bizjet",cat:"regional",seats:40,range:2700,speed:840,fuelL100:360,price:10000000,maint:5400,crew:2500},
  {id:"c939-concept-widebody-g-ant",name:"C939 (concept widebody géant)",maker:"COMAC",fam:"C939 (concept",cat:"wide",seats:390,range:13850,speed:880,fuelL100:2760,price:46200000,maint:21700,crew:13800},
  {id:"c909-bir-acteur-turboprop-concept",name:"C909 biréacteur à turboprop (concept)",maker:"COMAC",fam:"C909 biréacteur",cat:"turboprop",seats:60,range:1700,speed:490,fuelL100:260,price:5400000,maint:3900,crew:1700},
  {id:"c919-h2-saf-tude-propulsion-verte",name:"C919 H2 / SAF (étude propulsion verte)",maker:"COMAC",fam:"C919 H2",cat:"narrow",seats:168,range:6860,speed:840,fuelL100:804,price:13440000,maint:11720,crew:5860},
  {id:"comac-next-gen-narrowbody-2030s",name:"COMAC next-gen narrowbody (2030s)",maker:"COMAC",fam:"COMAC next-gen",cat:"narrow",seats:200,range:7500,speed:840,fuelL100:900,price:16000000,maint:13000,crew:6500},
  {id:"emb-145-proto-1er-vol-ao-t-1995",name:"EMB 145 proto (1er vol août 1995)",maker:"Embraer",fam:"EMB 145",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"erj-145-erj-145lr-er",name:"ERJ 145 (ERJ-145LR/ER)",maker:"Embraer",fam:"ERJ 145",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"erj-145xr-extra-range",name:"ERJ 145XR (Extra Range)",maker:"Embraer",fam:"ERJ 145XR",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"erj-145mp-maritime-patrol",name:"ERJ 145MP (Maritime Patrol)",maker:"Embraer",fam:"ERJ 145MP",cat:"turboprop",seats:50,range:1550,speed:485,fuelL100:230,price:4500000,maint:3500,crew:1550},
  {id:"erj-145eu-ep-er-lr",name:"ERJ 145EU / EP / ER / LR",maker:"Embraer",fam:"ERJ 145EU",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"erj-145-harbin-chine",name:"ERJ 145 Harbin (Chine)",maker:"Embraer",fam:"ERJ 145",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"erj-140-erj-140lr-er",name:"ERJ 140 (ERJ-140LR/ER)",maker:"Embraer",fam:"ERJ 140",cat:"regional",seats:44,range:2820,speed:840,fuelL100:376,price:11000000,maint:5640,crew:2600},
  {id:"erj-135-erj-135lr-er",name:"ERJ 135 (ERJ-135LR/ER)",maker:"Embraer",fam:"ERJ 135",cat:"regional",seats:37,range:2610,speed:840,fuelL100:348,price:9250000,maint:5220,crew:2425},
  {id:"erj-135-legacy-600-bizjet",name:"ERJ 135 Legacy 600 (bizjet)",maker:"Embraer",fam:"ERJ 135",cat:"regional",seats:14,range:1920,speed:840,fuelL100:256,price:5000000,maint:3840,crew:1850},
  {id:"legacy-650-650e",name:"Legacy 650 / 650E",maker:"Embraer",fam:"Legacy 650",cat:"regional",seats:14,range:1920,speed:840,fuelL100:256,price:5000000,maint:3840,crew:1850},
  {id:"emb-145-aew-c-concept",name:"EMB 145 AEW&C (concept)",maker:"Embraer",fam:"EMB 145",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"embraer-170-e170-100-200-std-lr-ar",name:"Embraer 170 (E170-100/200 STD/LR/AR)",maker:"Embraer",fam:"Embraer 170",cat:"regional",seats:72,range:3660,speed:840,fuelL100:488,price:18000000,maint:7320,crew:3300},
  {id:"embraer-170-su-scope-clause-70-plac",name:"Embraer 170 SU (scope clause 70 places)",maker:"Embraer",fam:"Embraer 170",cat:"regional",seats:70,range:3600,speed:840,fuelL100:480,price:17500000,maint:7200,crew:3250},
  {id:"embraer-175-e175-std-lr-ar",name:"Embraer 175 (E175 STD/LR/AR)",maker:"Embraer",fam:"Embraer 175",cat:"regional",seats:82,range:3960,speed:840,fuelL100:528,price:20500000,maint:7920,crew:3550},
  {id:"embraer-175-su-scope-clause-76",name:"Embraer 175 SU (scope clause 76)",maker:"Embraer",fam:"Embraer 175",cat:"regional",seats:76,range:3780,speed:840,fuelL100:504,price:19000000,maint:7560,crew:3400},
  {id:"embraer-175-sc-ll-70-seats-e175",name:"Embraer 175 SC / LL (70 seats E175)",maker:"Embraer",fam:"Embraer 175",cat:"regional",seats:70,range:3600,speed:840,fuelL100:480,price:17500000,maint:7200,crew:3250},
  {id:"embraer-190-e190-100-200-std-lr-ar",name:"Embraer 190 (E190-100/200 STD/LR/AR)",maker:"Embraer",fam:"Embraer 190",cat:"regional",seats:105,range:4650,speed:840,fuelL100:620,price:26250000,maint:9300,crew:4125},
  {id:"embraer-190sr-short-range-concept",name:"Embraer 190SR (Short Range, concept)",maker:"Embraer",fam:"Embraer 190SR",cat:"regional",seats:110,range:4800,speed:840,fuelL100:640,price:27500000,maint:9600,crew:4250},
  {id:"embraer-195-e195-100-200-std-lr-ar",name:"Embraer 195 (E195-100/200 STD/LR/AR)",maker:"Embraer",fam:"Embraer 195",cat:"narrow",seats:116,range:5820,speed:840,fuelL100:648,price:9280000,maint:9640,crew:4820},
  {id:"e195x-tude-130-pax-2008-2010",name:"E195X (étude 130 pax, 2008-2010)",maker:"Embraer",fam:"E195X (étude",cat:"narrow",seats:130,range:6100,speed:840,fuelL100:690,price:10400000,maint:10200,crew:5100},
  {id:"lineage-1000-e190-bizjet-10-19-pax",name:"Lineage 1000 (E190 bizjet, 10-19 pax)",maker:"Embraer",fam:"Lineage 1000",cat:"regional",seats:14,range:1920,speed:840,fuelL100:256,price:5000000,maint:3840,crew:1850},
  {id:"lineage-1000e",name:"Lineage 1000E",maker:"Embraer",fam:"Lineage 1000E",cat:"regional",seats:14,range:1920,speed:840,fuelL100:256,price:5000000,maint:3840,crew:1850},
  {id:"e175-e2-erj-170-200",name:"E175-E2 (ERJ 170-200)",maker:"Embraer",fam:"E175-E2 (ERJ",cat:"regional",seats:84,range:4020,speed:840,fuelL100:536,price:21000000,maint:8040,crew:3600},
  {id:"e190-e2-erj-190-300-std",name:"E190-E2 (ERJ 190-300 STD)",maker:"Embraer",fam:"E190-E2 (ERJ",cat:"regional",seats:105,range:4650,speed:840,fuelL100:620,price:26250000,maint:9300,crew:4125},
  {id:"e195-e2-erj-190-400",name:"E195-E2 (ERJ 190-400)",maker:"Embraer",fam:"E195-E2 (ERJ",cat:"narrow",seats:133,range:6160,speed:840,fuelL100:699,price:10640000,maint:10320,crew:5160},
  {id:"emb-120er-er-combi",name:"EMB 120ER / ER Combi",maker:"Embraer",fam:"EMB 120ER",cat:"turboprop",seats:30,range:1250,speed:475,fuelL100:170,price:2700000,maint:2700,crew:1250},
  {id:"embraer-energia-9-19-pax-turboprop",name:"Embraer Energia 9-19 pax (turboprop)",maker:"Embraer",fam:"Embraer Energia",cat:"turboprop",seats:14,range:1010,speed:465,fuelL100:122,price:2000000,maint:2060,crew:1010},
  {id:"embraer-energia-30-pax-turboprop-hy",name:"Embraer Energia 30 pax (turboprop hybride)",maker:"Embraer",fam:"Embraer Energia",cat:"turboprop",seats:30,range:1250,speed:475,fuelL100:170,price:2700000,maint:2700,crew:1250},
  {id:"embraer-energia-50-pax-jet-r-gional",name:"Embraer Energia 50 pax (jet régional)",maker:"Embraer",fam:"Embraer Energia",cat:"regional",seats:50,range:3000,speed:840,fuelL100:400,price:12500000,maint:6000,crew:2750},
  {id:"embraer-turbo-electric-single-aisle",name:"Embraer turbo-electric single aisle (concept)",maker:"Embraer",fam:"Embraer turbo-electric",cat:"regional",seats:100,range:4500,speed:840,fuelL100:600,price:25000000,maint:9000,crew:4000},
  {id:"boeing-embraer-commercial-jv-annul-",name:"Boeing-Embraer Commercial (JV annulée)",maker:"Embraer",fam:"Boeing-Embraer Commercial",cat:"narrow",seats:150,range:6500,speed:840,fuelL100:750,price:12000000,maint:11000,crew:5500},
  {id:"e-jet-successeur-hypoth-tique-nma-b",name:"E-Jet successeur hypothétique (NMA brésil)",maker:"Embraer",fam:"E-Jet successeur",cat:"narrow",seats:150,range:6500,speed:840,fuelL100:750,price:12000000,maint:11000,crew:5500},
  {id:"atr-42-200-300-prototype-prod",name:"ATR 42-200 / -300 (prototype+prod.)",maker:"ATR",fam:"ATR 42-200",cat:"turboprop",seats:46,range:1490,speed:480,fuelL100:218,price:4140000,maint:3340,crew:1490},
  {id:"atr-42-300-qc-quick-change",name:"ATR 42-300 QC (Quick Change)",maker:"ATR",fam:"ATR 42-300",cat:"turboprop",seats:48,range:1520,speed:480,fuelL100:224,price:4320000,maint:3420,crew:1520},
  {id:"atr-42-300f-cargo",name:"ATR 42-300F (cargo)",maker:"ATR",fam:"ATR 42-300F",cat:"turboprop",seats:10,range:950,speed:465,fuelL100:110,price:2000000,maint:1900,crew:950},
  {id:"atr-42-320",name:"ATR 42-320",maker:"ATR",fam:"ATR 42-320",cat:"turboprop",seats:48,range:1520,speed:480,fuelL100:224,price:4320000,maint:3420,crew:1520},
  {id:"atr-42-400",name:"ATR 42-400",maker:"ATR",fam:"ATR 42-400",cat:"turboprop",seats:48,range:1520,speed:480,fuelL100:224,price:4320000,maint:3420,crew:1520},
  {id:"atr-42-500-qc-quick-change",name:"ATR 42-500 QC (Quick Change)",maker:"ATR",fam:"ATR 42-500",cat:"turboprop",seats:48,range:1520,speed:480,fuelL100:224,price:4320000,maint:3420,crew:1520},
  {id:"atr-42-600s-stol",name:"ATR 42-600S (STOL)",maker:"ATR",fam:"ATR 42-600S",cat:"turboprop",seats:49,range:1535,speed:480,fuelL100:227,price:4410000,maint:3460,crew:1535},
  {id:"atr-42-600-h3-concept-h2",name:"ATR 42-600 H3 (concept H2)",maker:"ATR",fam:"ATR 42-600",cat:"turboprop",seats:42,range:1430,speed:480,fuelL100:206,price:3780000,maint:3180,crew:1430},
  {id:"atr-42f-cargo-militaire-projet-1987",name:"ATR 42F (cargo militaire, projet 1987)",maker:"ATR",fam:"ATR 42F",cat:"turboprop",seats:10,range:950,speed:465,fuelL100:110,price:2000000,maint:1900,crew:950},
  {id:"atr-42-200-sp-cial-12-maritime",name:"ATR 42-200 spécial (12 maritime)",maker:"ATR",fam:"ATR 42-200",cat:"turboprop",seats:42,range:1430,speed:480,fuelL100:206,price:3780000,maint:3180,crew:1430},
  {id:"atr-42-500-mp-maritime-patrol",name:"ATR 42-500 MP (Maritime Patrol)",maker:"ATR",fam:"ATR 42-500",cat:"turboprop",seats:50,range:1550,speed:485,fuelL100:230,price:4500000,maint:3500,crew:1550},
  {id:"atr-72-100-initial",name:"ATR 72-100 (initial)",maker:"ATR",fam:"ATR 72-100",cat:"turboprop",seats:69,range:1835,speed:490,fuelL100:287,price:6210000,maint:4260,crew:1835},
  {id:"atr-72-210-pw127",name:"ATR 72-210 (PW127)",maker:"ATR",fam:"ATR 72-210",cat:"turboprop",seats:72,range:1880,speed:495,fuelL100:296,price:6480000,maint:4380,crew:1880},
  {id:"atr-72-200-qc-quick-change",name:"ATR 72-200 QC (Quick Change)",maker:"ATR",fam:"ATR 72-200",cat:"turboprop",seats:70,range:1850,speed:495,fuelL100:290,price:6300000,maint:4300,crew:1850},
  {id:"atr-72-200f-cargo",name:"ATR 72-200F (cargo)",maker:"ATR",fam:"ATR 72-200F",cat:"turboprop",seats:10,range:950,speed:465,fuelL100:110,price:2000000,maint:1900,crew:950},
  {id:"atr-72-500-qc",name:"ATR 72-500 QC",maker:"ATR",fam:"ATR 72-500",cat:"turboprop",seats:70,range:1850,speed:495,fuelL100:290,price:6300000,maint:4300,crew:1850},
  {id:"atr-72-600-qc",name:"ATR 72-600 QC",maker:"ATR",fam:"ATR 72-600",cat:"turboprop",seats:70,range:1850,speed:495,fuelL100:290,price:6300000,maint:4300,crew:1850},
  {id:"atr-72-600f-freighter-d-di",name:"ATR 72-600F (freighter dédié)",maker:"ATR",fam:"ATR 72-600F",cat:"turboprop",seats:10,range:950,speed:465,fuelL100:110,price:2000000,maint:1900,crew:950},
  {id:"atr-72-600-h3-concept-h2",name:"ATR 72-600 H3 (concept H2)",maker:"ATR",fam:"ATR 72-600",cat:"turboprop",seats:72,range:1880,speed:495,fuelL100:296,price:6480000,maint:4380,crew:1880},
  {id:"atr-72-600-hybride-evo",name:"ATR 72-600 hybride EVO",maker:"ATR",fam:"ATR 72-600",cat:"turboprop",seats:72,range:1880,speed:495,fuelL100:296,price:6480000,maint:4380,crew:1880},
  {id:"atr-72-mp-asw-maritime",name:"ATR 72 MP / ASW (maritime)",maker:"ATR",fam:"ATR 72",cat:"turboprop",seats:50,range:1550,speed:485,fuelL100:230,price:4500000,maint:3500,crew:1550},
  {id:"atr-72-special-ras-72-pakistan",name:"ATR 72 Special (RAS-72 Pakistan)",maker:"ATR",fam:"ATR 72",cat:"turboprop",seats:50,range:1550,speed:485,fuelL100:230,price:4500000,maint:3500,crew:1550},
  {id:"atr-72-600-higher-capacity-78pax",name:"ATR 72-600 Higher Capacity (78pax+)",maker:"ATR",fam:"ATR 72-600",cat:"turboprop",seats:78,range:1970,speed:495,fuelL100:314,price:7020000,maint:4620,crew:1970},
  {id:"atr-52c-militaire",name:"ATR 52C (militaire)",maker:"ATR",fam:"ATR 52C",cat:"turboprop",seats:50,range:1550,speed:485,fuelL100:230,price:4500000,maint:3500,crew:1550},
  {id:"atr-82-d-riv-86-places-1986-1996",name:"ATR 82 (dérivé 86 places, 1986-1996)",maker:"ATR",fam:"ATR 82",cat:"turboprop",seats:86,range:2090,speed:500,fuelL100:338,price:7740000,maint:4940,crew:2090},
  {id:"atr-90-92-1988-farnborough-concept",name:"ATR 90 / 92 (1988 Farnborough concept)",maker:"ATR",fam:"ATR 90",cat:"turboprop",seats:100,range:2300,speed:510,fuelL100:380,price:9000000,maint:5500,crew:2300},
  {id:"atr-100-2009-2018",name:"ATR 100 (2009-2018)",maker:"ATR",fam:"ATR 100",cat:"turboprop",seats:95,range:2225,speed:505,fuelL100:365,price:8550000,maint:5300,crew:2225},
  {id:"atr-evo-famille-hybride-lectrique",name:"ATR EVO (famille hybride-électrique)",maker:"ATR",fam:"ATR EVO",cat:"turboprop",seats:72,range:1880,speed:495,fuelL100:296,price:6480000,maint:4380,crew:1880},
  {id:"atr-evo-42-version-courte-evo",name:"ATR EVO 42 (version courte EVO)",maker:"ATR",fam:"ATR EVO",cat:"turboprop",seats:42,range:1430,speed:480,fuelL100:206,price:3780000,maint:3180,crew:1430},
];

// ═══════════════════════════════════════
//  AIRPORTS — 1 per country, ~105 airports
// ═══════════════════════════════════════
const AIRPORTS = [
  {code:"CDG",city:"Paris",country:"France",lon:2.5,lat:49.0,size:"mega",pd:2500},
  {code:"LHR",city:"Londres",country:"Royaume-Uni",lon:-0.4,lat:51.5,size:"mega",pd:2800},
  {code:"FRA",city:"Francfort",country:"Allemagne",lon:8.6,lat:50.0,size:"mega",pd:2200},
  {code:"AMS",city:"Amsterdam",country:"Pays-Bas",lon:4.8,lat:52.3,size:"large",pd:1800},
  {code:"MAD",city:"Madrid",country:"Espagne",lon:-3.6,lat:40.5,size:"large",pd:1500},
  {code:"FCO",city:"Rome",country:"Italie",lon:12.2,lat:41.8,size:"large",pd:1400},
  {code:"BRU",city:"Bruxelles",country:"Belgique",lon:4.5,lat:50.9,size:"medium",pd:1200},
  {code:"ZRH",city:"Zurich",country:"Suisse",lon:8.5,lat:47.5,size:"large",pd:2000},
  {code:"VIE",city:"Vienne",country:"Autriche",lon:16.6,lat:48.1,size:"large",pd:1400},
  {code:"PRG",city:"Prague",country:"Rép. Tchèque",lon:14.3,lat:50.1,size:"medium",pd:900},
  {code:"WAW",city:"Varsovie",country:"Pologne",lon:21.0,lat:52.2,size:"medium",pd:900},
  {code:"BUD",city:"Budapest",country:"Hongrie",lon:19.0,lat:47.4,size:"medium",pd:800},
  {code:"OTP",city:"Bucarest",country:"Roumanie",lon:26.1,lat:44.6,size:"medium",pd:700},
  {code:"ARN",city:"Stockholm",country:"Suède",lon:17.9,lat:59.6,size:"large",pd:1600},
  {code:"OSL",city:"Oslo",country:"Norvège",lon:11.1,lat:60.2,size:"medium",pd:1500},
  {code:"CPH",city:"Copenhague",country:"Danemark",lon:12.6,lat:55.6,size:"large",pd:1600},
  {code:"HEL",city:"Helsinki",country:"Finlande",lon:24.9,lat:60.3,size:"medium",pd:1400},
  {code:"LIS",city:"Lisbonne",country:"Portugal",lon:-9.1,lat:38.8,size:"large",pd:1200},
  {code:"ATH",city:"Athènes",country:"Grèce",lon:23.9,lat:37.9,size:"large",pd:1100},
  {code:"KBP",city:"Kiev",country:"Ukraine",lon:30.9,lat:50.3,size:"medium",pd:700},
  {code:"SVO",city:"Moscou",country:"Russie",lon:37.4,lat:55.9,size:"mega",pd:1800},
  {code:"IST",city:"Istanbul",country:"Turquie",lon:28.8,lat:41.0,size:"mega",pd:1600},
  {code:"SOF",city:"Sofia",country:"Bulgarie",lon:23.4,lat:42.7,size:"small",pd:600},
  {code:"BEG",city:"Belgrade",country:"Serbie",lon:20.3,lat:44.8,size:"small",pd:600},
  {code:"RIX",city:"Riga",country:"Lettonie",lon:23.9,lat:56.9,size:"small",pd:700},
  {code:"REK",city:"Reykjavik",country:"Islande",lon:-22.6,lat:64.0,size:"small",pd:1200},
  {code:"DUB",city:"Dublin",country:"Irlande",lon:-6.3,lat:53.4,size:"large",pd:1500},
  {code:"JFK",city:"New York",country:"États-Unis",lon:-73.8,lat:40.6,size:"mega",pd:3000},
  {code:"LAX",city:"Los Angeles",country:"États-Unis",lon:-118.4,lat:33.9,size:"mega",pd:2800},
  {code:"YYZ",city:"Toronto",country:"Canada",lon:-79.6,lat:43.7,size:"large",pd:2000},
  {code:"MEX",city:"Mexico",country:"Mexique",lon:-99.1,lat:19.4,size:"large",pd:1200},
  {code:"HAV",city:"La Havane",country:"Cuba",lon:-82.4,lat:23.0,size:"medium",pd:700},
  {code:"BOG",city:"Bogotá",country:"Colombie",lon:-74.1,lat:4.7,size:"large",pd:1000},
  {code:"LIM",city:"Lima",country:"Pérou",lon:-77.1,lat:-12.0,size:"medium",pd:900},
  {code:"GRU",city:"São Paulo",country:"Brésil",lon:-46.5,lat:-23.4,size:"large",pd:1100},
  {code:"EZE",city:"Buenos Aires",country:"Argentine",lon:-58.5,lat:-34.8,size:"large",pd:1000},
  {code:"SCL",city:"Santiago",country:"Chili",lon:-70.8,lat:-33.4,size:"medium",pd:900},
  {code:"CCS",city:"Caracas",country:"Venezuela",lon:-66.9,lat:10.6,size:"medium",pd:800},
  {code:"UIO",city:"Quito",country:"Équateur",lon:-78.5,lat:-0.1,size:"small",pd:700},
  {code:"MVD",city:"Montevideo",country:"Uruguay",lon:-56.0,lat:-34.8,size:"small",pd:800},
  {code:"DXB",city:"Dubaï",country:"Émirats Arabes",lon:55.4,lat:25.3,size:"mega",pd:2500},
  {code:"RUH",city:"Riyad",country:"Arabie Saoudite",lon:46.7,lat:24.7,size:"large",pd:2000},
  {code:"DOH",city:"Doha",country:"Qatar",lon:51.6,lat:25.3,size:"large",pd:2200},
  {code:"KWI",city:"Koweït",country:"Koweït",lon:47.9,lat:29.2,size:"medium",pd:1500},
  {code:"AMM",city:"Amman",country:"Jordanie",lon:36.0,lat:31.7,size:"medium",pd:900},
  {code:"CAI",city:"Le Caire",country:"Égypte",lon:31.4,lat:30.1,size:"large",pd:1200},
  {code:"CMN",city:"Casablanca",country:"Maroc",lon:-7.6,lat:33.4,size:"medium",pd:900},
  {code:"ALG",city:"Alger",country:"Algérie",lon:3.2,lat:36.7,size:"medium",pd:800},
  {code:"TUN",city:"Tunis",country:"Tunisie",lon:10.2,lat:36.8,size:"medium",pd:800},
  {code:"DAK",city:"Dakar",country:"Sénégal",lon:-17.5,lat:14.7,size:"medium",pd:700},
  {code:"ABJ",city:"Abidjan",country:"Côte d'Ivoire",lon:-3.9,lat:5.4,size:"medium",pd:800},
  {code:"ACC",city:"Accra",country:"Ghana",lon:-0.2,lat:5.6,size:"medium",pd:900},
  {code:"LOS",city:"Lagos",country:"Nigéria",lon:3.3,lat:6.6,size:"large",pd:1100},
  {code:"NBO",city:"Nairobi",country:"Kenya",lon:36.9,lat:-1.3,size:"medium",pd:900},
  {code:"ADD",city:"Addis-Abeba",country:"Éthiopie",lon:38.8,lat:9.0,size:"medium",pd:800},
  {code:"JNB",city:"Johannesburg",country:"Afrique du Sud",lon:28.2,lat:-26.1,size:"large",pd:1300},
  {code:"LAD",city:"Luanda",country:"Angola",lon:13.2,lat:-8.9,size:"medium",pd:900},
  {code:"TNR",city:"Antananarivo",country:"Madagascar",lon:47.5,lat:-18.8,size:"small",pd:600},
  {code:"IKA",city:"Téhéran",country:"Iran",lon:51.1,lat:35.7,size:"large",pd:1000},
  {code:"BGW",city:"Bagdad",country:"Irak",lon:44.2,lat:33.3,size:"medium",pd:800},
  {code:"TAS",city:"Tachkent",country:"Ouzbékistan",lon:69.3,lat:41.3,size:"medium",pd:700},
  {code:"ALA",city:"Almaty",country:"Kazakhstan",lon:77.0,lat:43.4,size:"medium",pd:800},
  {code:"ULN",city:"Oulan-Bator",country:"Mongolie",lon:106.8,lat:47.8,size:"small",pd:500},
  {code:"DEL",city:"New Delhi",country:"Inde",lon:77.1,lat:28.6,size:"mega",pd:1500},
  {code:"BOM",city:"Mumbai",country:"Inde",lon:72.9,lat:19.1,size:"large",pd:1300},
  {code:"KHI",city:"Karachi",country:"Pakistan",lon:67.2,lat:24.9,size:"large",pd:1000},
  {code:"DAC",city:"Dacca",country:"Bangladesh",lon:90.4,lat:23.8,size:"medium",pd:700},
  {code:"CMB",city:"Colombo",country:"Sri Lanka",lon:79.9,lat:7.2,size:"medium",pd:800},
  {code:"KTM",city:"Katmandou",country:"Népal",lon:85.4,lat:27.7,size:"small",pd:600},
  {code:"BKK",city:"Bangkok",country:"Thaïlande",lon:100.7,lat:13.7,size:"mega",pd:1800},
  {code:"SIN",city:"Singapour",country:"Singapour",lon:103.9,lat:1.4,size:"mega",pd:2200},
  {code:"KUL",city:"Kuala Lumpur",country:"Malaisie",lon:101.7,lat:2.7,size:"large",pd:1400},
  {code:"CGK",city:"Jakarta",country:"Indonésie",lon:106.7,lat:-6.1,size:"large",pd:1100},
  {code:"MNL",city:"Manille",country:"Philippines",lon:121.0,lat:14.5,size:"large",pd:1200},
  {code:"SGN",city:"Hô-Chi-Minh",country:"Viêt Nam",lon:106.7,lat:10.8,size:"medium",pd:1000},
  {code:"RGN",city:"Rangoun",country:"Myanmar",lon:96.1,lat:16.9,size:"medium",pd:700},
  {code:"PEK",city:"Pékin",country:"Chine",lon:116.6,lat:40.1,size:"mega",pd:2000},
  {code:"ICN",city:"Séoul",country:"Corée du Sud",lon:126.4,lat:37.5,size:"mega",pd:2000},
  {code:"HND",city:"Tokyo",country:"Japon",lon:139.8,lat:35.6,size:"mega",pd:2800},
  {code:"TPE",city:"Taipei",country:"Taïwan",lon:121.2,lat:25.1,size:"large",pd:1500},
  {code:"HKG",city:"Hong Kong",country:"Hong Kong",lon:113.9,lat:22.3,size:"mega",pd:2500},
  {code:"SYD",city:"Sydney",country:"Australie",lon:151.2,lat:-33.9,size:"large",pd:1800},
  {code:"AKL",city:"Auckland",country:"Nouvelle-Zélande",lon:174.8,lat:-37.0,size:"medium",pd:1500},
  {code:"NAN",city:"Nadi",country:"Fidji",lon:177.4,lat:-17.8,size:"small",pd:500},
  {code:"PPT",city:"Papeete",country:"Polynésie fr.",lon:-149.6,lat:-17.6,size:"small",pd:500},
  {code:"GUA",city:"Guatemala",country:"Guatemala",lon:-90.5,lat:14.6,size:"small",pd:600},
  {code:"HRE",city:"Harare",country:"Zimbabwe",lon:31.1,lat:-17.9,size:"small",pd:600},
  {code:"LBV",city:"Libreville",country:"Gabon",lon:9.4,lat:0.5,size:"small",pd:700},
];

const FUEL_PRICE = 0.75;

function distKm(a, b) {
  const R = 6371;
  const lat1 = a.lat * Math.PI/180, lat2 = b.lat * Math.PI/180;
  const dLat = (b.lat - a.lat) * Math.PI/180;
  const dLon = (b.lon - a.lon) * Math.PI/180;
  const x = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x)));
}

function calcRevPerAc(from, to, acId, fillRate) {
  const d = distKm(from, to);
  const ac = ALL_AIRCRAFT.find(a => a.id === acId);
  if (!ac) return 0;
  const pp = d < 1000 ? 0.17 : d < 3000 ? 0.13 : d < 7000 ? 0.09 : 0.07;
  return Math.round(ac.seats * fillRate * d * pp * 2);
}

function calcCostPerAc(from, to, acId) {
  const d = distKm(from, to);
  const ac = ALL_AIRCRAFT.find(a => a.id === acId);
  if (!ac) return {fuel:0,crew:0,parking:0,maint:0,total:0};
  const fuel = Math.round((ac.fuelL100/100) * d * 2 * FUEL_PRICE);
  const crew = ac.crew * 2;
  const parking = Math.round((from.pd + to.pd) / 2);
  const maint = ac.maint;
  const total = fuel + crew + parking + maint;
  return {fuel, crew, parking, maint, total};
}

function fmt(n) {
  const abs = Math.abs(n), s = n < 0 ? "-" : "";
  if (abs >= 1e9) return `${s}$${(abs/1e9).toFixed(2)}Md`;
  if (abs >= 1e6) return `${s}$${(abs/1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${s}$${(abs/1e3).toFixed(0)}k`;
  return `${s}$${abs.toFixed(0)}`;
}

const CAT_COLOR = {turboprop:"#a78bfa",regional:"#38bdf8",narrow:"#0af",wide:"#0f9",jumbo:"#fb0",supersonic:"#ff6090"};
const MAKER_COLOR = {
  ATR:"#a78bfa",Embraer:"#38bdf8",COMAC:"#f87171",Airbus:"#0af",Boeing:"#fb0",
  Bombardier:"#f97316",Fokker:"#22d3ee",Douglas:"#a3e635",
  "McDonnell Douglas":"#86efac","McDonnell":"#86efac",
  Antonov:"#fbbf24",Tupolev:"#fb923c",Ilyushin:"#f43f5e",
  Yakovlev:"#e879f9",Sukhoi:"#c084fc",Irkut:"#818cf8",
  Saab:"#34d399",BAC:"#2dd4bf",Dassault:"#38bdf8",
  Lockheed:"#60a5fa",Vickers:"#a78bfa",Convair:"#f472b6",
  Gulfstream:"#fcd34d","de Havilland":"#6ee7b7",DHC:"#6ee7b7",
  Cessna:"#93c5fd",Beechcraft:"#c4b5fd",
  "BAE Systems":"#5eead4","Hawker Siddeley":"#4ade80",
  HAL:"#fb7185",Mitsubishi:"#f9a8d4",Dornier:"#d4d4d8",
  Shorts:"#94a3b8",CASA:"#fde68a",Harbin:"#fca5a5",Xian:"#fdba74",
  Canadair:"#86efac","Aérospatiale":"#38bdf8","Sud Aviation":"#5eead4",
};
function makerColor(m){return MAKER_COLOR[m]||"#667";}

// ═══════════════════════════════════════
//  LIVERY SYSTEM — Aircraft silhouettes & paint
// ═══════════════════════════════════════
const LIVERY_DEFAULTS = {
  bodyColor:"#f8f8f8", primaryColor:"#1565c0",
  tailColor:"#0d47a1", engineColor:"#37474f", name:"MY AIRLINE"
};

function AircraftSilhouette({cat="narrow", livery={}, width=280}) {
  const l={...LIVERY_DEFAULTS,...livery};
  const [b,p,t,e,nm]=[l.bodyColor,l.primaryColor,l.tailColor,l.engineColor,(l.name||"").toUpperCase().slice(0,18)];
  const h=Math.round(width*90/300);
  const wins = (xs,y,r=2.5)=>xs.map((x,i)=><circle key={i} cx={x} cy={y} r={r} fill="#d6eeff" stroke="#9bb" strokeWidth="0.3"/>);

  const shapes={
    narrow:(
      <>
        <path d="M278,45 C276,41 268,38 252,38 L65,38 C45,38 24,40 18,45 C24,50 45,52 65,52 L252,52 C268,52 276,49 278,45Z" fill={b} stroke="#b0b0b0" strokeWidth="0.6"/>
        <rect x="74" y="41" width="178" height="8" fill={p} opacity="0.8"/>
        <rect x="18" y="41" width="40" height="8" fill={t} opacity="0.9"/>
        <path d="M24,38 C22,24 30,16 40,18 L42,38Z" fill={t} stroke="#b0b0b0" strokeWidth="0.5"/>
        <path d="M27,38 L19,28 L38,30 L40,38Z" fill={b} stroke="#b0b0b0" strokeWidth="0.4"/>
        <path d="M27,52 L19,62 L38,60 L40,52Z" fill={b} stroke="#b0b0b0" strokeWidth="0.4"/>
        <path d="M215,52 L185,75 L205,75 L228,52Z" fill={b} stroke="#b0b0b0" strokeWidth="0.4"/>
        <ellipse cx="194" cy="75" rx="16" ry="5" fill={e} stroke="#222" strokeWidth="0.5"/>
        <ellipse cx="186" cy="75" rx="5" ry="4" fill="#1a1a1a"/>
        {wins([105,122,139,156,173,190,207,224,241,258],42.5)}
        <text x="165" y="50.5" textAnchor="middle" fontSize="6" fontFamily="sans-serif" fill={t} fontWeight="bold" opacity="0.85">{nm}</text>
        <path d="M252,45 C262,42 272,43 278,45 C272,47 262,48 252,45Z" fill="#e0e0e0"/>
      </>
    ),
    wide:(
      <>
        <path d="M278,45 C276,40 266,36 248,36 L65,36 C44,36 22,39 16,45 C22,51 44,54 65,54 L248,54 C266,54 276,50 278,45Z" fill={b} stroke="#b0b0b0" strokeWidth="0.6"/>
        <rect x="74" y="40" width="174" height="10" fill={p} opacity="0.8"/>
        <rect x="16" y="40" width="42" height="10" fill={t} opacity="0.9"/>
        <path d="M22,36 C20,20 28,12 38,14 L40,36Z" fill={t} stroke="#b0b0b0" strokeWidth="0.5"/>
        <path d="M26,36 L17,24 L38,27 L40,36Z" fill={b} stroke="#b0b0b0" strokeWidth="0.4"/>
        <path d="M26,54 L17,66 L38,63 L40,54Z" fill={b} stroke="#b0b0b0" strokeWidth="0.4"/>
        <path d="M220,54 L182,80 L208,80 L234,54Z" fill={b} stroke="#b0b0b0" strokeWidth="0.4"/>
        <ellipse cx="200" cy="80" rx="19" ry="6" fill={e} stroke="#222" strokeWidth="0.5"/>
        <ellipse cx="191" cy="80" rx="6" ry="5" fill="#1a1a1a"/>
        <ellipse cx="170" cy="76" rx="15" ry="5" fill={e} stroke="#222" strokeWidth="0.5"/>
        <ellipse cx="162" cy="76" rx="5" ry="4" fill="#1a1a1a"/>
        {wins([105,122,139,156,173,190,207,224,241,258],43)}
        <text x="165" y="51" textAnchor="middle" fontSize="6.5" fontFamily="sans-serif" fill={t} fontWeight="bold" opacity="0.85">{nm}</text>
        <path d="M248,45 C260,41 272,43 278,45 C272,47 260,49 248,45Z" fill="#e0e0e0"/>
      </>
    ),
    jumbo:(
      <>
        <path d="M272,45 C270,38 260,34 242,34 L80,34 C55,34 22,38 16,45 C22,52 55,56 80,56 L242,56 C260,56 270,52 272,45Z" fill={b} stroke="#b0b0b0" strokeWidth="0.6"/>
        <path d="M210,34 C218,30 228,28 240,28 L240,34Z" fill={b} stroke="#b0b0b0" strokeWidth="0.5"/>
        <ellipse cx="225" cy="31" rx="15" ry="3.5" fill={b} stroke="#ccc" strokeWidth="0.4"/>
        <rect x="80" y="38" width="162" height="10" fill={p} opacity="0.8"/>
        <rect x="16" y="38" width="48" height="10" fill={t} opacity="0.9"/>
        <path d="M20,34 C18,18 28,10 40,12 L42,34Z" fill={t} stroke="#b0b0b0" strokeWidth="0.5"/>
        <path d="M24,34 L14,22 L40,25 L42,34Z" fill={b} stroke="#b0b0b0" strokeWidth="0.4"/>
        <path d="M24,56 L14,68 L40,65 L42,56Z" fill={b} stroke="#b0b0b0" strokeWidth="0.4"/>
        <path d="M218,56 L182,82 L210,82 L238,56Z" fill={b} stroke="#b0b0b0" strokeWidth="0.4"/>
        {[196,218,168,146].map((cx,i)=>(
          <g key={i}><ellipse cx={cx} cy="82" rx="14" ry="5" fill={e} stroke="#222" strokeWidth="0.5"/>
          <ellipse cx={cx-7} cy="82" rx="4.5" ry="3.8" fill="#1a1a1a"/></g>
        ))}
        {wins([100,116,132,148,164,180,196,212,228,244,260],41)}
        <text x="170" y="51" textAnchor="middle" fontSize="6.5" fontFamily="sans-serif" fill={t} fontWeight="bold" opacity="0.85">{nm}</text>
        <path d="M242,45 C256,40 268,42 272,45 C268,48 256,50 242,45Z" fill="#e0e0e0"/>
      </>
    ),
    regional:(
      <>
        <path d="M276,45 C274,42 267,39 254,39 L70,39 C52,39 26,41 20,45 C26,49 52,51 70,51 L254,51 C267,51 274,48 276,45Z" fill={b} stroke="#b0b0b0" strokeWidth="0.6"/>
        <rect x="78" y="41.5" width="176" height="7" fill={p} opacity="0.8"/>
        <rect x="20" y="41.5" width="38" height="7" fill={t} opacity="0.9"/>
        <path d="M26,39 C24,23 34,15 44,17 L46,39Z" fill={t} stroke="#b0b0b0" strokeWidth="0.5"/>
        <path d="M30,39 L20,32 L42,34 L44,39Z" fill={b} stroke="#b0b0b0" strokeWidth="0.4"/>
        <path d="M30,51 L20,58 L42,56 L44,51Z" fill={b} stroke="#b0b0b0" strokeWidth="0.4"/>
        <path d="M210,44 L200,39 L220,38 L228,44 L220,50 L200,49Z" fill={b} stroke="#aaa" strokeWidth="0.4"/>
        <path d="M215,44 L205,39 L225,38 L234,44 L225,50 L205,49Z" fill={b} stroke="#aaa" strokeWidth="0.4"/>
        <ellipse cx="213" cy="37" rx="16" ry="5" fill={e} stroke="#222" strokeWidth="0.5"/>
        <ellipse cx="205" cy="37" rx="5" ry="4" fill="#1a1a1a"/>
        <ellipse cx="213" cy="53" rx="16" ry="5" fill={e} stroke="#222" strokeWidth="0.5"/>
        <ellipse cx="205" cy="53" rx="5" ry="4" fill="#1a1a1a"/>
        {wins([90,105,120,135,150,165,180,195],43)}
        <text x="145" y="50" textAnchor="middle" fontSize="6" fontFamily="sans-serif" fill={t} fontWeight="bold" opacity="0.85">{nm}</text>
        <path d="M254,45 C264,42 273,43 276,45 C273,47 264,48 254,45Z" fill="#e0e0e0"/>
      </>
    ),
    turboprop:(
      <>
        <path d="M268,45 C266,42 258,40 244,40 L72,40 C55,40 30,42 22,45 C30,48 55,50 72,50 L244,50 C258,50 266,48 268,45Z" fill={b} stroke="#b0b0b0" strokeWidth="0.6"/>
        <rect x="80" y="42" width="164" height="6" fill={p} opacity="0.8"/>
        <rect x="22" y="42" width="36" height="6" fill={t} opacity="0.9"/>
        <path d="M28,40 C26,27 34,19 43,21 L44,40Z" fill={t} stroke="#b0b0b0" strokeWidth="0.5"/>
        <path d="M32,40 L22,32 L42,34 L43,40Z" fill={b} stroke="#b0b0b0" strokeWidth="0.4"/>
        <path d="M32,50 L22,58 L42,56 L43,50Z" fill={b} stroke="#b0b0b0" strokeWidth="0.4"/>
        <path d="M190,40 L175,22 L205,22 L215,40Z" fill={b} stroke="#aaa" strokeWidth="0.4"/>
        <path d="M190,50 L175,68 L205,68 L215,50Z" fill={b} stroke="#aaa" strokeWidth="0.4"/>
        <ellipse cx="192" cy="21" rx="12" ry="4" fill={e} stroke="#333" strokeWidth="0.5"/>
        <ellipse cx="192" cy="69" rx="12" ry="4" fill={e} stroke="#333" strokeWidth="0.5"/>
        <ellipse cx="275" cy="22" rx="8" ry="22" fill="none" stroke={e} strokeWidth="1.5" opacity="0.5"/>
        <ellipse cx="275" cy="22" rx="4" ry="18" fill="none" stroke={e} strokeWidth="1" opacity="0.3"/>
        <ellipse cx="275" cy="68" rx="8" ry="22" fill="none" stroke={e} strokeWidth="1.5" opacity="0.5"/>
        <ellipse cx="275" cy="68" rx="4" ry="18" fill="none" stroke={e} strokeWidth="1" opacity="0.3"/>
        {wins([88,103,118,133,148,163,178],43)}
        <text x="135" y="48.5" textAnchor="middle" fontSize="6" fontFamily="sans-serif" fill={t} fontWeight="bold" opacity="0.85">{nm}</text>
        <path d="M244,45 C255,42 264,43 268,45 C264,47 255,48 244,45Z" fill="#e0e0e0"/>
      </>
    ),
    supersonic:(
      <>
        <path d="M285,45 C280,43 265,42 240,41 L120,41 C80,41 40,42 20,45 C40,48 80,49 120,49 L240,49 C265,48 280,47 285,45Z" fill={b} stroke="#b0b0b0" strokeWidth="0.6"/>
        <path d="M240,41 L200,20 L165,28 L155,41Z" fill={b} stroke="#aaa" strokeWidth="0.4"/>
        <path d="M240,49 L200,70 L165,62 L155,49Z" fill={b} stroke="#aaa" strokeWidth="0.4"/>
        <rect x="50" y="42.5" width="190" height="5" fill={p} opacity="0.8"/>
        <rect x="20" y="42.5" width="28" height="5" fill={t} opacity="0.9"/>
        {[194,218,170,146].map((cx,i)=>(
          <g key={i}><ellipse cx={cx-(i<2?0:0)} cy={i<2?22:68} rx="12" ry="4" fill={e} stroke="#333" strokeWidth="0.5"/>
          <ellipse cx={cx-6} cy={i<2?22:68} rx="4" ry="3" fill="#1a1a1a"/></g>
        ))}
        <path d="M22,40 C20,34 26,30 34,31 L36,40Z" fill={t} stroke="#b0b0b0" strokeWidth="0.5"/>
        {wins([70,90,110,130,150,170,190,210,230],43.5,2)}
        <text x="138" y="48.5" textAnchor="middle" fontSize="5.5" fontFamily="sans-serif" fill={t} fontWeight="bold" opacity="0.85">{nm}</text>
        <path d="M240,45 C258,43 278,44 285,45 C278,46 258,47 240,45Z" fill="#e8e8e8"/>
      </>
    ),
  };

  return (
    <svg viewBox="0 0 300 90" width={width} height={h} style={{display:"block"}}>
      <rect width="300" height="90" fill="#07111e" rx="4"/>
      {shapes[cat]||shapes.narrow}
    </svg>
  );
}

function LiveryEditor({uid, acName, acCat, livery, onSave, onClose}) {
  const [loc, setLoc] = useState({...LIVERY_DEFAULTS,...livery});
  const set = (k,v) => setLoc(l=>({...l,[k]:v}));

  function exportSVG() {
    const meta = JSON.stringify(loc).replace(/'/g,"&apos;");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 90" data-skytycoon-livery='${meta}' data-aircraft="${acName}">
  <rect width="300" height="90" fill="#07111e" rx="4"/>
  <!-- Livery: body=${loc.bodyColor} primary=${loc.primaryColor} tail=${loc.tailColor} engine=${loc.engineColor} name=${loc.name} -->
  <!-- Edit colors above and re-import, or edit data-skytycoon-livery JSON directly -->
</svg>`;
    const blob = new Blob([svg],{type:"image/svg+xml"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href=url; a.download=`livery_${(acName||"aircraft").replace(/\s+/g,"_")}.svg`; a.click();
    URL.revokeObjectURL(url);
  }

  function importSVG(e) {
    const file = e.target.files?.[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const txt = ev.target.result;
      const m = txt.match(/data-skytycoon-livery='([^']+)'/);
      if(m) {
        try { const parsed=JSON.parse(m[1]); setLoc({...LIVERY_DEFAULTS,...parsed}); } catch(err){}
      } else {
        // Try parsing fill colors from SVG manually
        const fills = [...txt.matchAll(/fill="(#[0-9a-fA-F]{3,8})"/g)].map(x=>x[1]).filter(c=>c!="#07111e"&&c!="#d6eeff"&&c!="#1a1a1a"&&c!="#e0e0e0"&&c!="#b0b0b0");
        if(fills[0]) set("bodyColor",fills[0]);
        if(fills[1]) set("primaryColor",fills[1]);
        if(fills[2]) set("tailColor",fills[2]);
        if(fills[3]) set("engineColor",fills[3]);
      }
    };
    reader.readAsText(file);
    e.target.value="";
  }

  const fields=[["bodyColor","✈ Carrosserie"],["primaryColor","🎨 Couleur principale"],["tailColor","⬛ Empennage"],["engineColor","⚙ Réacteurs"]];

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" style={{width:580}} onClick={e=>e.stopPropagation()}>
        <div className="o gb" style={{fontSize:13,letterSpacing:3,marginBottom:14}}>LIVRÉE — {acName}</div>
        <div style={{marginBottom:16,borderRadius:4,overflow:"hidden",border:"1px solid #0d2035"}}>
          <AircraftSilhouette cat={acCat} livery={loc} width={530}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          {fields.map(([k,label])=>(
            <div key={k}>
              <div style={{fontSize:10,color:"#446",marginBottom:5}}>{label}</div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <input type="color" value={loc[k]} onChange={e=>set(k,e.target.value)}
                  style={{width:40,height:32,padding:2,cursor:"pointer",background:"#050f1c",border:"1px solid #0d2035",borderRadius:2}}/>
                <input type="text" value={loc[k]} onChange={e=>set(k,e.target.value)}
                  style={{flex:1,fontFamily:"monospace",fontSize:12}}/>
              </div>
            </div>
          ))}
        </div>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:10,color:"#446",marginBottom:5}}>✏ NOM DE COMPAGNIE</div>
          <input value={loc.name||""} onChange={e=>set("name",e.target.value)} maxLength={20}
            placeholder="MY AIRLINE" style={{fontSize:13}}/>
        </div>
        <div style={{borderTop:"1px solid #0d2035",paddingTop:12,display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <div style={{display:"flex",gap:8}}>
            <button className="btn" onClick={exportSVG} style={{fontSize:10}}>⬇ EXPORTER SVG</button>
            <label className="btn" style={{fontSize:10,cursor:"pointer"}}>
              ⬆ IMPORTER SVG
              <input type="file" accept=".svg,image/svg+xml" onChange={importSVG} style={{display:"none"}}/>
            </label>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button className="btn btn-r" onClick={onClose}>ANNULER</button>
            <button className="btn btn-g" onClick={()=>{onSave(loc);onClose();}}>✓ APPLIQUER</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [money, setMoney] = useState(20000000);
  const [fleet, setFleet] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [day, setDay] = useState(1);
  const [tab, setTab] = useState("dashboard");
  const [notifs, setNotifs] = useState([]);
  const [totalPax, setTotalPax] = useState(0);
  const [reputation, setReputation] = useState(55);
  const [profit7, setProfit7] = useState([]);

  // Liveries — keyed by fleet uid
  const [liveries, setLiveries] = useState({});
  const [liveryOpen, setLiveryOpen] = useState(null); // fleet uid

  // Modals
  const [buyOpen, setBuyOpen] = useState(false);
  const [buyQ, setBuyQ] = useState("");
  const [buyMaker, setBuyMaker] = useState("Tous");
  const [buyCat, setBuyCat] = useState("Tous");
  const [catalogPage, setCatalogPage] = useState(0);
  const CATALOG_PAGE_SIZE = 40;
  const [routeOpen, setRouteOpen] = useState(false);
  const [rFrom, setRFrom] = useState(null);
  const [rTo, setRTo] = useState(null);
  const [rAcId, setRAcId] = useState("");
  const [rFromQ, setRFromQ] = useState("");
  const [rToQ, setRToQ] = useState("");
  const [addAcRoute, setAddAcRoute] = useState(null); // route id to add aircraft
  const [addAcId, setAddAcId] = useState("");

  // Map
  const svgRef = useRef(null);
  const [worldPaths, setWorldPaths] = useState([]);
  const [mapTooltip, setMapTooltip] = useState(null);
  const [projection, setProjection] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  // Load world map
  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://unpkg.com/topojson-client@3/dist/topojson.min.js";
    s.onload = async () => {
      try {
        const res = await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json");
        const world = await res.json();
        const countries = window.topojson.feature(world, world.objects.countries);
        const proj = d3.geoNaturalEarth1().scale(153).translate([480,280]);
        const path = d3.geoPath().projection(proj);
        const paths = countries.features.map(f => path(f)).filter(Boolean);
        setWorldPaths(paths);
        setProjection(() => proj);
        setMapReady(true);
      } catch(e) { console.error(e); }
    };
    document.head.appendChild(s);
  }, []);

  const addNotif = useCallback((msg, type="info") => {
    const id = Date.now() + Math.random();
    setNotifs(n => [{ id, msg, type }, ...n.slice(0, 4)]);
    setTimeout(() => setNotifs(n => n.filter(x => x.id !== id)), 4500);
  }, []);

  const fillRate = useMemo(() => Math.min(0.97, 0.62 + reputation/200), [reputation]);

  const routeMetrics = useCallback((r) => {
    const from = AIRPORTS.find(a => a.code === r.from);
    const to = AIRPORTS.find(a => a.code === r.to);
    if (!from || !to) return {rev:0,cost:0,net:0,d:0,aircraft:[]};
    const d = distKm(from, to);
    let rev = 0, cost = 0;
    const acDetail = r.aircraft.map(uid => {
      const fa = fleet.find(f => f.uid === uid);
      if (!fa) return null;
      const rev1 = calcRevPerAc(from, to, fa.id, fillRate);
      const c1 = calcCostPerAc(from, to, fa.id);
      rev += rev1; cost += c1.total;
      return {uid, name:fa.name, rev1, cost1:c1, net1: rev1 - c1.total};
    }).filter(Boolean);
    return {rev, cost, net:rev-cost, d, acDetail};
  }, [fleet, fillRate]);

  const totalMetrics = useMemo(() => {
    let rev=0, cost=0;
    routes.forEach(r => { const m = routeMetrics(r); rev+=m.rev; cost+=m.cost; });
    return {rev, cost, net:rev-cost};
  }, [routes, routeMetrics]);

  function runDay() {
    let income=0, costs=0, pax=0;
    routes.forEach(r => {
      const m = routeMetrics(r);
      income += m.rev; costs += m.cost;
      const from = AIRPORTS.find(a=>a.code===r.from);
      const to = AIRPORTS.find(a=>a.code===r.to);
      if (from && to) {
        r.aircraft.forEach(uid => {
          const fa = fleet.find(f=>f.uid===uid);
          if (fa) pax += Math.round(fa.seats * fillRate);
        });
      }
    });
    const net = income - costs;
    setMoney(m => m + net);
    setTotalPax(p => p + pax);
    setReputation(rep => Math.min(100, Math.max(0, rep + (net>0?0.3:-0.5))));
    setProfit7(p => [...p.slice(-6), net]);
    setDay(d => d+1);
    addNotif(routes.length>0 ? `Jour ${day+1}: ${net>=0?"+":""}${fmt(net)} · ${pax.toLocaleString()} pax` : `Jour ${day+1} — Aucune route active`, net>=0?"success":"error");
  }

  function buyAc(ac) {
    if (money < ac.price) { addNotif("Fonds insuffisants !", "error"); return; }
    setMoney(m => m - ac.price);
    const uid = `${ac.id}-${Date.now()}`;
    setFleet(f => [...f, {...ac, uid, routeId:null}]);
    addNotif(`✈ ${ac.name} acquis !`, "success");
    setBuyOpen(false);
  }

  function openRoute() {
    if (!rFrom || !rTo || !rAcId) { addNotif("Remplissez tous les champs", "error"); return; }
    const avail = fleet.find(f => f.id===rAcId && !f.routeId);
    if (!avail) { addNotif("Aucun avion disponible de ce type !", "error"); return; }
    const from = AIRPORTS.find(a=>a.code===rFrom);
    const to = AIRPORTS.find(a=>a.code===rTo);
    const d = distKm(from, to);
    const ac = ALL_AIRCRAFT.find(a=>a.id===rAcId);
    if (ac.range < d) { addNotif(`Rayon insuffisant ! (${d.toLocaleString()} km > ${ac.range.toLocaleString()} km)`, "error"); return; }
    const routeId = `rt-${Date.now()}`;
    setFleet(f => f.map(x => x.uid===avail.uid ? {...x, routeId} : x));
    setRoutes(r => [...r, {id:routeId, from:rFrom, to:rTo, aircraft:[avail.uid]}]);
    addNotif(`🛫 Route ${rFrom}→${rTo} ouverte !`, "success");
    setRouteOpen(false); setRFrom(null); setRTo(null); setRAcId(""); setRFromQ(""); setRToQ("");
  }

  function addAircraftToRoute(routeId, acId) {
    const avail = fleet.find(f => f.id===acId && !f.routeId);
    if (!avail) { addNotif("Aucun avion disponible !", "error"); return; }
    const r = routes.find(x=>x.id===routeId);
    const from = AIRPORTS.find(a=>a.code===r?.from);
    const to = AIRPORTS.find(a=>a.code===r?.to);
    if (from && to) {
      const d = distKm(from, to);
      const ac = ALL_AIRCRAFT.find(a=>a.id===acId);
      if (ac.range < d) { addNotif(`Rayon insuffisant pour ${ac.name}`, "error"); return; }
    }
    setFleet(f => f.map(x => x.uid===avail.uid ? {...x, routeId} : x));
    setRoutes(r => r.map(x => x.id===routeId ? {...x, aircraft:[...x.aircraft, avail.uid]} : x));
    addNotif(`✈ Avion ajouté à la route !`, "success");
    setAddAcRoute(null); setAddAcId("");
  }

  function removeAcFromRoute(routeId, uid) {
    setFleet(f => f.map(x => x.uid===uid ? {...x, routeId:null} : x));
    setRoutes(r => r.map(x => x.id===routeId ? {...x, aircraft:x.aircraft.filter(a=>a!==uid)} : x).filter(x=>x.aircraft.length>0));
    addNotif("Avion retiré de la route", "info");
  }

  function closeRoute(routeId) {
    const r = routes.find(x=>x.id===routeId);
    if (r) setFleet(f => f.map(x => r.aircraft.includes(x.uid) ? {...x, routeId:null} : x));
    setRoutes(r => r.filter(x=>x.id!==routeId));
    addNotif("Route fermée", "info");
  }

  // Filtered airports for route modal
  const apFrom = useMemo(() => AIRPORTS.filter(a =>
    `${a.code} ${a.city} ${a.country}`.toLowerCase().includes(rFromQ.toLowerCase())
  ).slice(0,15), [rFromQ]);
  const apTo = useMemo(() => AIRPORTS.filter(a =>
    a.code!==rFrom && `${a.code} ${a.city} ${a.country}`.toLowerCase().includes(rToQ.toLowerCase())
  ).slice(0,15), [rToQ, rFrom]);

  // Filtered aircraft for buy modal
  const makers = ["Tous","ATR","Airbus","Antonov","Aérospatiale","BAC","BAE Systems","Beechcraft","Boeing","Bombardier","CASA","COMAC","Canadair","Cessna","Convair","DHC","Dassault","Dornier","Douglas","Embraer","Fokker","Gulfstream","HAL","Harbin","Hawker Siddeley","Ilyushin","Irkut","Lockheed","McDonnell Douglas","Mitsubishi","Saab","Shorts","Sud Aviation","Sukhoi","Tupolev","Vickers","Xian","Yakovlev","de Havilland"];
  const cats = ["Tous", "turboprop", "regional", "narrow", "wide", "jumbo", "supersonic"];
  const filteredAc = useMemo(() => ALL_AIRCRAFT.filter(ac => {
    const q = buyQ.toLowerCase();
    const mOk = buyMaker==="Tous" || ac.maker===buyMaker;
    const cOk = buyCat==="Tous" || ac.cat===buyCat;
    const nOk = !q || ac.name.toLowerCase().includes(q) || ac.fam.toLowerCase().includes(q) || ac.maker.toLowerCase().includes(q);
    return mOk && cOk && nOk;
  }), [buyQ, buyMaker, buyCat]);

  useEffect(() => { setCatalogPage(0); }, [buyQ, buyMaker, buyCat]);

  const pagedAc = filteredAc.slice(catalogPage * CATALOG_PAGE_SIZE, (catalogPage + 1) * CATALOG_PAGE_SIZE);
  const totalPages = Math.ceil(filteredAc.length / CATALOG_PAGE_SIZE);

  // Map projection for airports
  const mapAirports = useMemo(() => {
    if (!projection) return [];
    return AIRPORTS.map(ap => {
      const [x,y] = projection([ap.lon, ap.lat]);
      return {...ap, x, y};
    });
  }, [projection]);

  const routePairs = useMemo(() => {
    if (!projection) return [];
    return routes.map(r => {
      const from = AIRPORTS.find(a=>a.code===r.from);
      const to = AIRPORTS.find(a=>a.code===r.to);
      if (!from || !to) return null;
      const [x1,y1] = projection([from.lon, from.lat]);
      const [x2,y2] = projection([to.lon, to.lat]);
      const m = routeMetrics(r);
      return {id:r.id, x1,y1, x2,y2, profitable: m.net>=0};
    }).filter(Boolean);
  }, [routes, projection, routeMetrics]);

  const activeAps = useMemo(() => new Set(routes.flatMap(r=>[r.from,r.to])), [routes]);

  // Route preview
  const preview = useMemo(() => {
    if (!rFrom || !rTo || !rAcId) return null;
    const from = AIRPORTS.find(a=>a.code===rFrom);
    const to = AIRPORTS.find(a=>a.code===rTo);
    if (!from||!to) return null;
    const d = distKm(from,to);
    const ac = ALL_AIRCRAFT.find(a=>a.id===rAcId);
    if (!ac) return null;
    const rev = calcRevPerAc(from,to,rAcId,fillRate);
    const costs = calcCostPerAc(from,to,rAcId);
    return {d, ac, rev, costs, canFly: ac.range>=d, fuelTotal: Math.round(ac.fuelL100/100*d*2)};
  }, [rFrom,rTo,rAcId,fillRate]);

  return (
    <div style={{minHeight:"100vh",background:"#030c18",color:"#ddeeff",fontFamily:"'Share Tech Mono','Courier New',monospace"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;800;900&family=Share+Tech+Mono&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .o{font-family:'Orbitron',monospace}
        .gb{color:#0af;text-shadow:0 0 10px #0af5}
        .gg{color:#0f9;text-shadow:0 0 8px #0f94}
        .gr{color:#f55;text-shadow:0 0 8px #f554}
        .go{color:#fb0;text-shadow:0 0 8px #fb04}
        .card{background:#071525;border:1px solid #0d2035;border-radius:3px;padding:16px;position:relative;overflow:hidden}
        .card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,#0af4,transparent)}
        .btn{padding:7px 15px;border:1px solid #0af;background:transparent;color:#0af;cursor:pointer;font-family:'Orbitron',monospace;font-size:10px;letter-spacing:1px;border-radius:2px;transition:all .15s;white-space:nowrap}
        .btn:hover{background:#0af15;box-shadow:0 0 12px #0af3} .btn:active{transform:scale(.97)}
        .btn-g{border-color:#0f9;color:#0f9}.btn-g:hover{background:#0f915;box-shadow:0 0 10px #0f93}
        .btn-r{border-color:#f55;color:#f55}.btn-r:hover{background:#f5515;box-shadow:0 0 10px #f553}
        .btn-o{border-color:#fb0;color:#fb0}.btn-o:hover{background:#fb015;box-shadow:0 0 10px #fb03}
        .btn-sm{padding:4px 10px;font-size:9px}
        .tab{padding:9px 16px;background:none;border:none;color:#446;cursor:pointer;font-family:'Orbitron',monospace;font-size:10px;letter-spacing:2px;border-bottom:2px solid transparent;transition:all .2s}
        .tab.on{color:#0af;border-bottom-color:#0af}.tab:hover:not(.on){color:#7af}
        input,select{background:#050f1c;border:1px solid #0d2035;color:#ddeeff;padding:7px 10px;border-radius:2px;font-family:'Share Tech Mono',monospace;font-size:12px;width:100%;outline:none;transition:border .15s}
        input:focus,select:focus{border-color:#0af}
        .modal-bg{position:fixed;inset:0;background:#0009;display:flex;align-items:center;justify-content:center;z-index:200;backdrop-filter:blur(5px)}
        .modal{background:#050e1b;border:1px solid #0af;border-radius:4px;padding:26px;width:720px;max-width:97vw;max-height:92vh;overflow-y:auto;box-shadow:0 0 50px #0af2;position:relative}
        .modal::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#0af,#0f9,#0af)}
        .ac-row{border:1px solid #0d2035;border-radius:3px;padding:12px 14px;cursor:pointer;transition:all .15s;background:#071525;display:flex;align-items:center;gap:12px}
        .ac-row:hover{border-color:#0af4;background:#081e38;box-shadow:0 0 8px #0af1}
        .ac-row.off{opacity:.35;cursor:not-allowed}
        .rt-row{border:1px solid #0d2035;border-radius:3px;padding:11px 14px;background:#071525;transition:border .15s}
        .rt-row:hover{border-color:#1a3555}
        .sc{background:#071525;border:1px solid #0d2035;border-radius:3px;padding:16px;text-align:center}
        .sc::after{content:'';display:block;height:1px;background:linear-gradient(90deg,transparent,#0af3,transparent);margin-top:14px}
        .notif-w{position:fixed;top:68px;right:14px;z-index:300;display:flex;flex-direction:column;gap:7px;pointer-events:none}
        .notif{background:#050e1b;border-radius:3px;padding:9px 14px;font-size:11px;min-width:210px;animation:sIn .2s ease}
        .ns{border-left:3px solid #0f9;color:#0f9}.ne{border-left:3px solid #f55;color:#f55}.ni{border-left:3px solid #0af;color:#0af}
        @keyframes sIn{from{transform:translateX(20px);opacity:0}to{transform:translateX(0);opacity:1}}
        .pill{display:inline-block;padding:2px 7px;border-radius:10px;font-size:9px;letter-spacing:1px;font-family:'Orbitron',monospace}
        .dd{background:#050f1c;border:1px solid #0d2035;border-top:none;border-radius:0 0 3px 3px;max-height:170px;overflow-y:auto;position:absolute;left:0;right:0;z-index:10}
        .dd-item{padding:7px 10px;cursor:pointer;border-bottom:1px solid #09182a;display:flex;justify-content:space-between;transition:background .1s}
        .dd-item:hover{background:#081e38}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#03080f}
        ::-webkit-scrollbar-thumb{background:#0d2035;border-radius:3px}
        .world-path{fill:#0a1e38;stroke:#0e2e52;stroke-width:0.4px;transition:fill .15s}
        .world-path:hover{fill:#0d2848}
        .graticule{fill:none;stroke:#071525;stroke-width:0.3px}
      `}</style>

      <div className="notif-w">
        {notifs.map(n => <div key={n.id} className={`notif n${n.type[0]}`}>{n.msg}</div>)}
      </div>

      {/* HEADER */}
      <div style={{background:"#040d1a",borderBottom:"1px solid #0d2035",padding:"0 20px",display:"flex",alignItems:"center",gap:18,height:56,position:"sticky",top:0,zIndex:100}}>
        <span className="o gb" style={{fontSize:16,fontWeight:900,letterSpacing:3}}>✈ SKY<span style={{color:"#0f9"}}>TYCOON</span></span>
        <div style={{flex:1}}/>
        {[["JOUR",day,"go"],["CAPITAL",fmt(money),money>=0?"gg":"gr"],["RÉPUTATION",`${Math.round(reputation)}%`,"gb"]].map(([l,v,c])=>(
          <span key={l} style={{display:"flex",alignItems:"center",gap:6}}>
            <span className="o" style={{fontSize:9,color:"#446",letterSpacing:2}}>{l}</span>
            <span className={`o ${c}`} style={{fontSize:14}}>{v}</span>
          </span>
        ))}
        <div style={{width:1,height:26,background:"#0d2035"}}/>
        <button className="btn btn-g" style={{fontWeight:700,fontSize:11,padding:"8px 20px"}} onClick={runDay}>▶ JOUR SUIVANT</button>
      </div>

      {/* TABS */}
      <div style={{background:"#040d1a",borderBottom:"1px solid #0d2035",padding:"0 20px",display:"flex",gap:2}}>
        {[["dashboard","TABLEAU DE BORD"],["fleet","FLOTTE"],["routes","ROUTES"],["map","CARTE MONDE"]].map(([k,v])=>(
          <button key={k} className={`tab ${tab===k?"on":""}`} onClick={()=>setTab(k)}>{v}</button>
        ))}
      </div>

      <div style={{padding:"20px",maxWidth:1180,margin:"0 auto"}}>

        {/* ════ DASHBOARD ════ */}
        {tab==="dashboard" && (
          <div>
            <div className="o" style={{fontSize:9,color:"#446",letterSpacing:3,marginBottom:16}}>— VUE GÉNÉRALE —</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18}}>
              {[
                {l:"AVIONS",v:fleet.length,s:`${fleet.filter(f=>f.routeId).length} en service`,c:"#0af"},
                {l:"ROUTES",v:routes.length,s:"actives",c:"#0f9"},
                {l:"REVENU / JOUR",v:fmt(totalMetrics.rev),s:`Coûts: ${fmt(totalMetrics.cost)}`,c:"#fb0"},
                {l:"PROFIT NET / JOUR",v:fmt(totalMetrics.net),s:`${totalPax.toLocaleString()} pax total`,c:totalMetrics.net>=0?"#0f9":"#f55"},
              ].map(s=>(
                <div key={s.l} className="sc">
                  <div className="o" style={{fontSize:9,color:"#446",letterSpacing:2,marginBottom:8}}>{s.l}</div>
                  <div className="o" style={{fontSize:20,color:s.c,textShadow:`0 0 14px ${s.c}7`,marginBottom:5}}>{s.v}</div>
                  <div style={{fontSize:10,color:"#446"}}>{s.s}</div>
                </div>
              ))}
            </div>
            {profit7.length > 0 && (
              <div className="card" style={{marginBottom:16}}>
                <div className="o" style={{fontSize:9,color:"#446",letterSpacing:2,marginBottom:12}}>HISTORIQUE PROFITS — 7 DERNIERS JOURS</div>
                <div style={{display:"flex",alignItems:"flex-end",gap:6,height:56}}>
                  {profit7.map((p,i)=>{
                    const max=Math.max(...profit7.map(Math.abs),1);
                    const h=Math.max(4,(Math.abs(p)/max)*52);
                    return <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                      <div style={{width:"100%",height:h,background:p>=0?"#0f93":"#f553",borderRadius:2,transition:"height .3s"}}/>
                      <div style={{fontSize:8,color:"#446"}}>{fmt(p)}</div>
                    </div>;
                  })}
                </div>
              </div>
            )}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div className="card">
                <div className="o" style={{fontSize:9,color:"#446",letterSpacing:2,marginBottom:14}}>ACTIONS RAPIDES</div>
                <div style={{display:"flex",flexDirection:"column",gap:9}}>
                  <button className="btn btn-o" onClick={()=>setBuyOpen(true)}>✈ ACHETER UN AVION ({ALL_AIRCRAFT.length} MODÈLES)</button>
                  <button className="btn btn-g" onClick={()=>setRouteOpen(true)}>⊕ OUVRIR UNE ROUTE</button>
                  <button className="btn" onClick={()=>setTab("map")}>🌍 CARTE DU RÉSEAU</button>
                </div>
              </div>
              <div className="card">
                <div className="o" style={{fontSize:9,color:"#446",letterSpacing:2,marginBottom:14}}>MÉTRIQUES</div>
                {[
                  ["Capital",fmt(money)],["Réputation",`${Math.round(reputation)}%`],
                  ["Remplissage",`${Math.round(fillRate*100)}%`],
                  ["Flotte",`${fleet.length} avion${fleet.length>1?"s":""}`],
                  ["Pax transportés",totalPax.toLocaleString()],
                  ["Kérosène"," $0.75/L"],
                ].map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #071525"}}>
                    <span style={{fontSize:11,color:"#446"}}>{k}</span>
                    <span className="gb" style={{fontSize:11}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════ FLEET ════ */}
        {tab==="fleet" && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <span className="o" style={{fontSize:9,color:"#446",letterSpacing:3}}>— FLOTTE — {fleet.length} AVION{fleet.length!==1?"S":""}</span>
              <button className="btn btn-o" onClick={()=>setBuyOpen(true)}>+ ACHETER</button>
            </div>
            {fleet.length===0 ? (
              <div className="card" style={{textAlign:"center",padding:60}}>
                <div style={{fontSize:48,opacity:.2,marginBottom:16}}>✈</div>
                <div className="o" style={{color:"#334",fontSize:13}}>Flotte vide — achetez votre premier avion !</div>
              </div>
            ) : (
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(420px,1fr))",gap:10}}>
                {fleet.map(ac=>{
                  const r = routes.find(x=>x.id===ac.routeId);
                  const liv = liveries[ac.uid]||{};
                  const mc = makerColor(ac.maker);
                  return (
                    <div key={ac.uid} className="rt-row" style={{padding:0,overflow:"hidden"}}>
                      <div style={{position:"relative",borderBottom:"1px solid #09182a"}}>
                        <AircraftSilhouette cat={ac.cat} livery={liv} width="100%"/>
                        <div style={{position:"absolute",top:6,right:8,display:"flex",gap:5}}>
                          <button className="btn btn-sm" style={{fontSize:9,padding:"3px 8px",borderColor:"#0af8",background:"#050e1b99"}}
                            onClick={()=>setLiveryOpen(ac.uid)}>🎨 LIVRÉE</button>
                        </div>
                        <div style={{position:"absolute",top:6,left:8}}>
                          <span className="pill" style={{background:`${CAT_COLOR[ac.cat]}22`,color:CAT_COLOR[ac.cat],border:`1px solid ${CAT_COLOR[ac.cat]}5`,fontSize:8}}>{ac.cat.toUpperCase()}</span>
                        </div>
                      </div>
                      <div style={{padding:"10px 14px"}}>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,flexWrap:"wrap"}}>
                          <div>
                            <div style={{display:"flex",alignItems:"center",gap:7}}>
                              <span className="o" style={{fontSize:12,color:"#ddeeff"}}>{ac.name}</span>
                              <span className="pill" style={{background:`${mc}18`,color:mc,border:`1px solid ${mc}4`}}>{ac.maker}</span>
                            </div>
                            <div style={{fontSize:10,color:"#446",marginTop:3}}>
                              💺{ac.seats}  ·  📏{ac.range.toLocaleString()}km  ·  ⚡{ac.speed}km/h  ·  ⛽{ac.fuelL100}L/100  ·  🔧{fmt(ac.maint)}/j
                            </div>
                          </div>
                          <div style={{textAlign:"right"}}>
                            {ac.routeId ? (
                              <span style={{fontSize:11,color:"#0f9"}}>🟢 {r?.from}→{r?.to}</span>
                            ) : (
                              <span style={{fontSize:11,color:"#446"}}>⚪ EN ATTENTE</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ════ ROUTES ════ */}
        {tab==="routes" && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <span className="o" style={{fontSize:9,color:"#446",letterSpacing:3}}>— RÉSEAU DE ROUTES — {routes.length} ACTIVE{routes.length!==1?"S":""}</span>
              <button className="btn btn-g" onClick={()=>setRouteOpen(true)}>+ NOUVELLE ROUTE</button>
            </div>
            {routes.length===0 ? (
              <div className="card" style={{textAlign:"center",padding:60}}>
                <div style={{fontSize:48,opacity:.2,marginBottom:16}}>🛫</div>
                <div className="o" style={{color:"#334",fontSize:13}}>Aucune route active</div>
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {routes.map(r=>{
                  const from=AIRPORTS.find(a=>a.code===r.from);
                  const to=AIRPORTS.find(a=>a.code===r.to);
                  if(!from||!to) return null;
                  const m=routeMetrics(r);
                  return (
                    <div key={r.id} className="rt-row">
                      {/* Route header */}
                      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",marginBottom:8}}>
                        <div style={{minWidth:68}}>
                          <div className="o gb" style={{fontSize:16}}>{r.from}</div>
                          <div style={{fontSize:9,color:"#446"}}>{from.city}</div>
                        </div>
                        <span style={{color:"#0af",fontSize:18}}>→</span>
                        <div style={{minWidth:68}}>
                          <div className="o gg" style={{fontSize:16}}>{r.to}</div>
                          <div style={{fontSize:9,color:"#446"}}>{to.city}</div>
                        </div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:10,color:"#446"}}>{m.d.toLocaleString()} km · {r.aircraft.length} avion{r.aircraft.length>1?"s":""}</div>
                        </div>
                        <div style={{textAlign:"right",minWidth:110}}>
                          <div className="gg" style={{fontSize:11}}>+{fmt(m.rev)}/j</div>
                          <div className="gr" style={{fontSize:10}}>−{fmt(m.cost)}/j</div>
                          <div className={`o ${m.net>=0?"gg":"gr"}`} style={{fontSize:13}}>{m.net>=0?"+":""}{fmt(m.net)}/j</div>
                        </div>
                        <div style={{display:"flex",gap:6}}>
                          <button className="btn btn-g btn-sm" onClick={()=>{setAddAcRoute(r.id);setAddAcId("");}}>+ Avion</button>
                          <button className="btn btn-r btn-sm" onClick={()=>closeRoute(r.id)}>✕</button>
                        </div>
                      </div>
                      {/* Aircraft list */}
                      <div style={{display:"flex",flexWrap:"wrap",gap:6,paddingTop:8,borderTop:"1px solid #09182a"}}>
                        {m.acDetail.map(a=>(
                          <div key={a.uid} style={{background:"#060f1c",border:"1px solid #0d2035",borderRadius:3,padding:"5px 10px",display:"flex",alignItems:"center",gap:8}}>
                            <span style={{fontSize:14}}>✈</span>
                            <div>
                              <div style={{fontSize:10,color:"#ddeeff"}}>{a.name}</div>
                              <div style={{fontSize:9,color:a.net1>=0?"#0f9":"#f55"}}>{a.net1>=0?"+":""}{fmt(a.net1)}/j</div>
                            </div>
                            <button className="btn btn-r" style={{padding:"2px 7px",fontSize:9}} onClick={()=>removeAcFromRoute(r.id,a.uid)}>✕</button>
                          </div>
                        ))}
                      </div>
                      {/* Add aircraft inline */}
                      {addAcRoute===r.id && (
                        <div style={{marginTop:10,display:"flex",gap:8,alignItems:"center"}}>
                          <select value={addAcId} onChange={e=>setAddAcId(e.target.value)} style={{flex:1}}>
                            <option value="">-- Sélectionner un avion disponible --</option>
                            {ALL_AIRCRAFT.map(ac=>{
                              const avail=fleet.filter(f=>f.id===ac.id&&!f.routeId).length;
                              if(avail===0) return null;
                              return <option key={ac.id} value={ac.id}>{ac.name} — {ac.seats} sièges, {ac.range.toLocaleString()}km ({avail} dispo)</option>;
                            })}
                          </select>
                          <button className="btn btn-g" onClick={()=>addAircraftToRoute(r.id,addAcId)} disabled={!addAcId}>Ajouter</button>
                          <button className="btn btn-r" onClick={()=>setAddAcRoute(null)}>✕</button>
                        </div>
                      )}
                    </div>
                  );
                })}
                <div style={{borderTop:"1px solid #0d2035",paddingTop:10,display:"flex",justifyContent:"flex-end",gap:20}}>
                  <span className="gg" style={{fontSize:12}}>Revenus: {fmt(totalMetrics.rev)}/j</span>
                  <span className="gr" style={{fontSize:12}}>Coûts: {fmt(totalMetrics.cost)}/j</span>
                  <span className={`o ${totalMetrics.net>=0?"gg":"gr"}`} style={{fontSize:14}}>NET: {fmt(totalMetrics.net)}/j</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════ MAP ════ */}
        {tab==="map" && (
          <div>
            <div className="o" style={{fontSize:9,color:"#446",letterSpacing:3,marginBottom:14}}>— CARTE DU RÉSEAU MONDIAL —</div>
            <div className="card" style={{padding:0,overflow:"hidden",position:"relative"}}>
              {!mapReady && (
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"#030c18",zIndex:5}}>
                  <div className="o gb" style={{fontSize:12,letterSpacing:3}}>CHARGEMENT DE LA CARTE...</div>
                </div>
              )}
              <svg ref={svgRef} viewBox="0 0 960 560" style={{width:"100%",background:"#030c18",display:"block"}}>
                <defs>
                  <radialGradient id="ocean" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="#061525"/>
                    <stop offset="100%" stopColor="#030c18"/>
                  </radialGradient>
                </defs>
                <rect width="960" height="560" fill="url(#ocean)"/>
                {/* World countries */}
                {worldPaths.map((d,i) => <path key={i} d={d} className="world-path"/>)}
                {/* Route lines */}
                {routePairs.map(r=>(
                  <line key={r.id} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
                    stroke={r.profitable?"#0f9":"#f55"} strokeWidth="1"
                    strokeDasharray="4 3" opacity=".7"/>
                ))}
                {/* Airports */}
                {mapAirports.map(ap=>{
                  const active=activeAps.has(ap.code);
                  const sz=ap.size==="mega"?5:ap.size==="large"?4:ap.size==="medium"?3:2.5;
                  const col=active?"#0f9":ap.size==="mega"?"#fb0":"#0af";
                  return (
                    <g key={ap.code}
                      onMouseEnter={()=>setMapTooltip(ap)}
                      onMouseLeave={()=>setMapTooltip(null)}
                      style={{cursor:"pointer"}}>
                      {active && <circle cx={ap.x} cy={ap.y} r={sz+4} fill={col} opacity=".12"/>}
                      <circle cx={ap.x} cy={ap.y} r={sz} fill={col} opacity={active?1:.7}
                        style={{filter:`drop-shadow(0 0 ${active?4:2}px ${col})`}}/>
                      {(active||ap.size==="mega") && (
                        <text x={ap.x+sz+2} y={ap.y+1.5} fontSize="8" fill="#8bf" fontFamily="monospace" opacity=".85">{ap.code}</text>
                      )}
                    </g>
                  );
                })}
              </svg>
              {mapTooltip && (
                <div style={{position:"absolute",bottom:10,left:10,background:"#050e1b",border:"1px solid #0af",borderRadius:3,padding:"8px 14px",pointerEvents:"none"}}>
                  <div className="o gb" style={{fontSize:13}}>{mapTooltip.code} — {mapTooltip.city}</div>
                  <div style={{fontSize:11,color:"#778",marginTop:2}}>{mapTooltip.country} · {mapTooltip.size.toUpperCase()}</div>
                  <div style={{fontSize:11,color:"#0af",marginTop:2}}>Parking: {fmt(mapTooltip.pd)}/j</div>
                </div>
              )}
            </div>
            <div style={{display:"flex",gap:16,marginTop:10,flexWrap:"wrap"}}>
              {[["🟡","Hub MEGA"],["🔵","Aéroport"],["🟢","Route active"],["─🟢─","Rentable"],["─🔴─","Déficitaire"]].map(([i,l])=>(
                <span key={l} style={{fontSize:10,color:"#446"}}>{i} {l}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ════════════════════════════════
          MODAL — CATALOGUE
      ════════════════════════════════ */}
      {buyOpen && (
        <div className="modal-bg" onClick={()=>setBuyOpen(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="o go" style={{fontSize:13,letterSpacing:3,marginBottom:16}}>CATALOGUE — {ALL_AIRCRAFT.length} AÉRONEFS</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr auto auto",gap:8,marginBottom:12}}>
              <input placeholder="🔍 Modèle, famille..." value={buyQ} onChange={e=>setBuyQ(e.target.value)}/>
              <select value={buyMaker} onChange={e=>setBuyMaker(e.target.value)} style={{width:110}}>
                {makers.map(m=><option key={m}>{m}</option>)}
              </select>
              <select value={buyCat} onChange={e=>setBuyCat(e.target.value)} style={{width:120}}>
                {cats.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:7,maxHeight:"55vh",overflowY:"auto"}}>
              {pagedAc.map(ac=>{
                const ok=money>=ac.price;
                const revFull=Math.round(ac.seats*1.0*5000*0.09*2);
                const mc=makerColor(ac.maker);
                return (
                  <div key={ac.id} className={`ac-row ${!ok?"off":""}`} onClick={()=>ok&&buyAc(ac)}
                    style={{padding:0,overflow:"hidden",flexDirection:"column",gap:0}}>
                    <AircraftSilhouette cat={ac.cat} livery={{name:ac.maker.toUpperCase()}} width="100%"/>
                    <div style={{padding:"8px 12px",display:"flex",alignItems:"center",gap:10}}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
                          <span className="o" style={{fontSize:11}}>{ac.name}</span>
                          <span className="pill" style={{background:`${mc}18`,color:mc,border:`1px solid ${mc}4`}}>{ac.maker}</span>
                          <span className="pill" style={{background:`${CAT_COLOR[ac.cat]}18`,color:CAT_COLOR[ac.cat],border:`1px solid ${CAT_COLOR[ac.cat]}4`}}>{ac.cat}</span>
                        </div>
                        <div style={{fontSize:10,color:"#446",marginTop:3,display:"flex",gap:10,flexWrap:"wrap"}}>
                          <span>💺{ac.seats}</span><span>⛽{ac.fuelL100}L/100</span>
                          <span>📏{ac.range.toLocaleString()}km</span><span>🚀{ac.speed}km/h</span>
                          <span>🔧{fmt(ac.maint)}/j</span>
                        </div>
                      </div>
                      <div style={{textAlign:"right",minWidth:80}}>
                        <div className={`o ${ok?"go":"gr"}`} style={{fontSize:13}}>{fmt(ac.price)}</div>
                        {!ok&&<div style={{fontSize:9,color:"#f554"}}>INSUFF.</div>}
                        {ok&&<div style={{fontSize:9,color:"#0f97"}}>≈{fmt(revFull)}/AR</div>}
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredAc.length===0&&<div style={{textAlign:"center",padding:30,color:"#446"}}>Aucun résultat</div>}
            </div>
            <div style={{marginTop:10,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{fontSize:11,color:"#446"}}>{filteredAc.length} aéronef{filteredAc.length>1?"s":""} — page {catalogPage+1}/{totalPages||1}</div>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <button className="btn" disabled={catalogPage===0} onClick={()=>setCatalogPage(p=>p-1)} style={{padding:"4px 10px",fontSize:12}}>◀</button>
                <button className="btn" disabled={catalogPage>=totalPages-1} onClick={()=>setCatalogPage(p=>p+1)} style={{padding:"4px 10px",fontSize:12}}>▶</button>
                <button className="btn btn-r" onClick={()=>setBuyOpen(false)} style={{marginLeft:8}}>✕ FERMER</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════
          MODAL — NOUVELLE ROUTE
      ════════════════════════════════ */}
      {routeOpen && (
        <div className="modal-bg" onClick={()=>setRouteOpen(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="o gg" style={{fontSize:13,letterSpacing:3,marginBottom:16}}>NOUVELLE ROUTE</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              {/* FROM */}
              <div>
                <div style={{fontSize:10,color:"#446",marginBottom:6}}>DÉPART</div>
                <div style={{position:"relative"}}>
                  <input placeholder="🔍 Code, ville, pays..." value={rFromQ}
                    onChange={e=>{setRFromQ(e.target.value);if(rFrom)setRFrom(null);}}/>
                  {rFromQ && !rFrom && apFrom.length>0 && (
                    <div className="dd">
                      {apFrom.map(ap=>(
                        <div key={ap.code} className="dd-item" onClick={()=>{setRFrom(ap.code);setRFromQ(`${ap.code} — ${ap.city}`)}}>
                          <span className="o gb" style={{fontSize:11}}>{ap.code}</span>
                          <span style={{fontSize:10,color:"#778"}}>{ap.city}, {ap.country}</span>
                          <span style={{fontSize:9,color:"#446"}}>{fmt(ap.pd)}/j</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {rFrom && <div style={{marginTop:5,fontSize:11}}>
                  <span className="o gb">{rFrom}</span>
                  <span style={{color:"#778"}}> — {AIRPORTS.find(a=>a.code===rFrom)?.city}</span>
                  <button style={{marginLeft:8,fontSize:10,background:"none",border:"none",color:"#f55",cursor:"pointer"}} onClick={()=>{setRFrom(null);setRFromQ("");}}>✕</button>
                </div>}
              </div>
              {/* TO */}
              <div>
                <div style={{fontSize:10,color:"#446",marginBottom:6}}>ARRIVÉE</div>
                <div style={{position:"relative"}}>
                  <input placeholder="🔍 Code, ville, pays..." value={rToQ}
                    onChange={e=>{setRToQ(e.target.value);if(rTo)setRTo(null);}}/>
                  {rToQ && !rTo && apTo.length>0 && (
                    <div className="dd">
                      {apTo.map(ap=>(
                        <div key={ap.code} className="dd-item" onClick={()=>{setRTo(ap.code);setRToQ(`${ap.code} — ${ap.city}`)}}>
                          <span className="o gg" style={{fontSize:11}}>{ap.code}</span>
                          <span style={{fontSize:10,color:"#778"}}>{ap.city}, {ap.country}</span>
                          <span style={{fontSize:9,color:"#446"}}>{fmt(ap.pd)}/j</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {rTo && <div style={{marginTop:5,fontSize:11}}>
                  <span className="o gg">{rTo}</span>
                  <span style={{color:"#778"}}> — {AIRPORTS.find(a=>a.code===rTo)?.city}</span>
                  <button style={{marginLeft:8,fontSize:10,background:"none",border:"none",color:"#f55",cursor:"pointer"}} onClick={()=>{setRTo(null);setRToQ("");}}>✕</button>
                </div>}
              </div>
            </div>
            <div style={{marginTop:14}}>
              <div style={{fontSize:10,color:"#446",marginBottom:6}}>AÉRONEF</div>
              <select value={rAcId} onChange={e=>setRAcId(e.target.value)}>
                <option value="">-- Sélectionner un modèle disponible --</option>
                {[...new Set(fleet.filter(f=>!f.routeId).map(f=>f.maker))].sort().map(mk=>{
                  const group = ALL_AIRCRAFT.filter(ac=>{
                    const avail=fleet.filter(f=>f.id===ac.id&&!f.routeId).length;
                    return ac.maker===mk && avail>0;
                  });
                  if(group.length===0) return null;
                  return <optgroup key={mk} label={`── ${mk} ──`}>
                    {group.map(ac=>{
                      const n=fleet.filter(f=>f.id===ac.id&&!f.routeId).length;
                      return <option key={ac.id} value={ac.id}>{ac.name} — {ac.seats}s, {ac.range.toLocaleString()}km ({n} dispo)</option>;
                    })}
                  </optgroup>;
                })}
              </select>
            </div>
            {/* Preview */}
            {preview && (
              <div style={{marginTop:14,background:"#060f1c",border:`1px solid ${preview.canFly?"#0d2035":"#5a1515"}`,borderRadius:3,padding:14}}>
                <div className="o" style={{fontSize:9,color:"#446",letterSpacing:2,marginBottom:10}}>APERÇU — {preview.d.toLocaleString()} KM</div>
                {!preview.canFly && <div className="gr" style={{fontSize:12,marginBottom:8}}>⚠ Rayon insuffisant ! ({preview.d.toLocaleString()} km &gt; {preview.ac.range.toLocaleString()} km)</div>}
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:10}}>
                  {[
                    ["Revenus/j",fmt(preview.rev),"#0f9"],
                    ["Carburant",fmt(preview.costs.fuel),"#f55"],
                    ["Équipage",fmt(preview.costs.crew),"#f55"],
                    ["Parking",fmt(preview.costs.parking),"#f55"],
                    ["Entretien",fmt(preview.costs.maint),"#f55"],
                    ["Coût total",fmt(preview.costs.total),"#f55"],
                  ].map(([k,v,c])=>(
                    <div key={k}><div style={{fontSize:9,color:"#446"}}>{k}</div><div style={{fontSize:13,color:c}}>{v}/j</div></div>
                  ))}
                </div>
                <div style={{borderTop:"1px solid #0d2035",paddingTop:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span className={`o ${preview.rev-preview.costs.total>=0?"gg":"gr"}`} style={{fontSize:14}}>
                    NET: {fmt(preview.rev-preview.costs.total)}/j
                  </span>
                  <span style={{fontSize:10,color:"#446"}}>
                    ⛽ {preview.fuelTotal.toLocaleString()} L/j · {preview.ac.fuelL100} L/100km
                  </span>
                </div>
              </div>
            )}
            <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:16}}>
              <button className="btn btn-r" onClick={()=>setRouteOpen(false)}>ANNULER</button>
              <button className="btn btn-g" style={{padding:"8px 22px"}} onClick={openRoute}>✓ CONFIRMER</button>
            </div>
          </div>
        </div>
      )}

      {/* ════ MODAL LIVRÉE ════ */}
      {liveryOpen && (()=>{
        const ac = fleet.find(f=>f.uid===liveryOpen);
        if(!ac) return null;
        return <LiveryEditor
          uid={liveryOpen}
          acName={ac.name}
          acCat={ac.cat}
          livery={liveries[liveryOpen]||{}}
          onSave={liv=>setLiveries(lv=>({...lv,[liveryOpen]:liv}))}
          onClose={()=>setLiveryOpen(null)}
        />;
      })()}
    </div>
  );
}
