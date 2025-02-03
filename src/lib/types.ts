// @/lib/types.ts
export interface User {
  id: string;
  name: string;
  registerNumber: string;
  department: string;
  email: string;
  level0: boolean | null;
  level1: boolean | null;
  level2: boolean | null;
  level3: boolean | null;
  level4: boolean | null;
  level5: boolean | null;
  level6: boolean | null;
}

export interface Flag {
  id: string;
  level: number;
  flag: string;
  encryptedFlag: string;
  iv: string;
}