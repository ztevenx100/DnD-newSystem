import { ComponentType } from 'react';

export type ComponentIcon = {
    [key: string]: ComponentType<any>;
};

export interface stageImageList {
    id: string;
    url: string;
}