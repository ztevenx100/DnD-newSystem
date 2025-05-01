import { DBEscenario, DBMapamundi } from "@core/types";

export interface WorldMapState {
    geographicalMap: DBMapamundi[][];
    listItemsMap: DBMapamundi[];
    currentStage: DBEscenario;
    imageStage: string;
    imageStageList: StageImageList[];
    loading: boolean;
}

export interface StageImageList {
    id: string;
    url: string;
}

export interface WorldMapActions {
    setGeographicalMap: (map: DBMapamundi[][]) => void;
    setListItemsMap: (items: DBMapamundi[]) => void;
    setCurrentStage: (stage: DBEscenario) => void;
    setImageStage: (url: string) => void;
    setImageStageList: (list: StageImageList[]) => void;
    setLoading: (loading: boolean) => void;
}

export interface WorldMapHookResult extends WorldMapState, WorldMapActions {}