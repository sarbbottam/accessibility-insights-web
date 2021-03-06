// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DialogRenderer } from '../dialog-renderer';
import { AxeResultsWithFrameLevel } from '../frameCommunicators/html-element-axe-results-helper';

export interface DrawerConfiguration {
    outlineStyle?: string;
    borderColor: string;
    showVisualization: boolean;
    textAlign?: string;
    cursor?: string;
    failureBoxConfig?: FailureBoxConfig;
    toolTip?: string;
    textBoxConfig?: TextBoxConfig;
    getBoundingRect?: (e: Element) => ClientRect | DOMRect;
}

export interface TextBoxConfig extends BoxConfig {
    boxHeight?: string;
}

export interface FailureBoxConfig extends BoxConfig {
    hasDialogView?: boolean;
}

export interface BoxConfig {
    fontColor: string;
    background: string;
    text: string;
    boxWidth?: string;
}

export interface StrokeConfiguration {
    stroke: string;
    strokeWidth: string;
    strokeDasharray?: string;
    showSolidFocusLine?: boolean;
}

export interface CircleConfiguration extends StrokeConfiguration {
    ellipseRx: string;
    ellipseRy: string;
    fill: string;
}

export interface TextConfiguration {
    textAnchor: string;
    fontColor: string;
    showTabIndexedLabel?: boolean;
}

export type LineConfiguration = StrokeConfiguration;

export interface SVGDrawerConfiguration {
    circle: CircleConfiguration;
    focusedCircle: CircleConfiguration;
    tabIndexLabel: TextConfiguration;
    line: LineConfiguration;
    focusedLine: LineConfiguration;
}

export interface SingleTargetDrawerConfiguration {
    injectedClassName: string;
}

export interface Formatter {
    getDrawerConfiguration(
        element: Node,
        data: AxeResultsWithFrameLevel,
    ): DrawerConfiguration | SVGDrawerConfiguration | SingleTargetDrawerConfiguration;
    getDialogRenderer(): DialogRenderer;
}
