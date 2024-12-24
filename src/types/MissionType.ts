export type MissionType = {
  id: number;
  name: string;
  code : string;
};

export type MissionLevel = {
  id: number;
  level: number;
  cost: number;
  production_per_hour: number;
};

export type Mission = {
  id: number;
  title: string;
  logo: string;
  
};
