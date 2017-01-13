/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as React from "react";

import {
    Classes,
    Intent,
    NumericInput,
    Position,
    Switch,
} from "@blueprintjs/core";

import BaseExample, { handleBooleanChange, handleNumberChange } from "./common/baseExample";
import { IntentSelect } from "./common/intentSelect";

export interface INumericInputExampleState {

    buttonPositionIndex?: number;

    minValueIndex?: number;
    maxValueIndex?: number;

    stepSizeIndex?: number;
    majorStepSizeIndex?: number;
    minorStepSizeIndex?: number;

    intent?: Intent;

    showDisabled?: boolean;
    showLargeSize?: boolean;
    showLeftIcon?: boolean;
    showReadOnly?: boolean;

    value?: string;
}

interface ISelectOption {
    label: string;
    value: any;
}

const MIN_VALUES: ISelectOption[] = [
    { label: "None", value: null },
    { label: "-10", value: -10 },
    { label: "0", value: 0 },
    { label: "10", value: 10 },
];

const MAX_VALUES: ISelectOption[] = [
    { label: "None", value: null },
    { label: "20", value: 20 },
    { label: "50", value: 50 },
    { label: "100", value: 100 },
];

const STEP_SIZES: ISelectOption[] = [
    { label: "1", value: 1 },
    { label: "1", value: 2 },
];

const MINOR_STEP_SIZES: ISelectOption[] = [
    { label: "None", value: null },
    { label: "0.1", value: 0.1 },
    { label: "0.2", value: 0.2 },
];

const MAJOR_STEP_SIZES: ISelectOption[] = [
    { label: "None", value: null },
    { label: "10", value: 10 },
    { label: "20", value: 20 },
];

const BUTTON_POSITIONS: ISelectOption[] = [
    { label: "None", value: null },
    { label: "Left", value: Position.LEFT },
    { label: "Right", value: Position.RIGHT },
];

export class NumericInputExample extends BaseExample<INumericInputExampleState> {

    public state: INumericInputExampleState = {
        buttonPositionIndex: 2,
        intent: Intent.NONE,
        majorStepSizeIndex: 1,
        maxValueIndex: 0,
        minValueIndex: 0,
        minorStepSizeIndex: 1,

        showDisabled: false,
        showLeftIcon: false,
        showReadOnly: false,

        stepSizeIndex: 0,

        value: "",
    };

    private handleMaxValueChange = handleNumberChange((maxValueIndex) => this.setState({ maxValueIndex }));
    private handleMinValueChange = handleNumberChange((minValueIndex) => this.setState({ minValueIndex }));
    private handleIntentChange = handleNumberChange((intent: Intent) => this.setState({ intent }));

    private handleButtonPositionChange = handleNumberChange((buttonPositionIndex) => {
        this.setState({ buttonPositionIndex });
    });

    private toggleDisabled = handleBooleanChange((showDisabled) => this.setState({ showDisabled }));
    private toggleLeftIcon = handleBooleanChange((showLeftIcon) => this.setState({ showLeftIcon }));
    private toggleReadOnly = handleBooleanChange((showReadOnly) => this.setState({ showReadOnly }));

    protected renderOptions() {
        const {
            buttonPositionIndex,
            intent,
            maxValueIndex,
            minValueIndex,
            showDisabled,
            showReadOnly,
            showLeftIcon,
        } = this.state;

        return [
            [
                this.renderSelectMenu("Minimum value", minValueIndex, MIN_VALUES, this.handleMinValueChange),
                this.renderSelectMenu("Maximum value", maxValueIndex, MAX_VALUES, this.handleMaxValueChange),
            ], [
                this.renderSelectMenu(
                    "Button position", buttonPositionIndex, BUTTON_POSITIONS, this.handleButtonPositionChange),
                <IntentSelect intent={intent} key="intent" onChange={this.handleIntentChange} />,
            ], [
                <label className={Classes.LABEL} key="modifierslabel">Modifiers</label>,
                this.renderSwitch("Disabled", showDisabled, this.toggleDisabled),
                this.renderSwitch("Read-only", showReadOnly, this.toggleReadOnly),
                this.renderSwitch("Left icon", showLeftIcon, this.toggleLeftIcon),
            ],
        ];
    }

    protected renderExample() {
        const { value } = this.state;

        return (
            <div>
                <NumericInput
                    buttonPosition={BUTTON_POSITIONS[this.state.buttonPositionIndex].value}
                    intent={this.state.intent}

                    min={MIN_VALUES[this.state.minValueIndex].value}
                    max={MAX_VALUES[this.state.maxValueIndex].value}

                    stepSize={STEP_SIZES[this.state.stepSizeIndex].value}
                    majorStepSize={MAJOR_STEP_SIZES[this.state.majorStepSizeIndex].value}
                    minorStepSize={MINOR_STEP_SIZES[this.state.minorStepSizeIndex].value}

                    disabled={this.state.showDisabled}
                    readOnly={this.state.showReadOnly}
                    leftIconName={this.state.showLeftIcon ? "variable" : null}
                    placeholder="Enter a number..."

                    onChange={this.handleChange}
                    onValueChange={this.handleValueChange}
                    onConfirm={this.handleConfirm}
                    value={value}
                />
                <br />
                <div className="numeric-input-example-key-value-wrapper">
                    <div className="numeric-input-example-key-label">Value:</div>
                    <code>{`"${value}"`}</code>
                </div>
            </div>
        );
    }

    private renderSwitch(label: string, checked: boolean, onChange: React.FormEventHandler<HTMLElement>) {
       return (
            <Switch
                checked={checked}
                label={label}
                key={label}
                onChange={onChange}
            />
        );
    }

    private renderSelectMenu(
        label: string,
        selectedValue: number | string,
        options: ISelectOption[],
        onChange: React.FormEventHandler<HTMLElement>,
    ) {
        return (
            <label className={Classes.LABEL} key={label}>
                {label}
                <div className={Classes.SELECT}>
                    <select value={selectedValue} onChange={onChange}>
                        {this.renderSelectMenuOptions(options)}
                    </select>
                </div>
            </label>
        );
    }

    private renderSelectMenuOptions(options: ISelectOption[]) {
        return options.map((option, index) => {
            return <option key={index} value={index}>{option.label}</option>;
        });
    }

    private handleChange = (e: React.FormEvent<HTMLInputElement>, value: string, isNumeric: boolean) => {
        console.log("   onChange", e, e.target.value);
        this.setState({ value });
    }

    private handleValueChange = (valueAsString: string, valueAsNumber: number) => {
        console.log("   onValueChange", valueAsString, valueAsNumber);
        this.setState({ value: valueAsString });
    }

    private handleConfirm = (value: string) => {
        let result;
        try {
            result = eval(value);
        } catch (e) {
            if (value === "20m") {
                result = 20000000;
            } else {
                result = "";
            }
        }
        this.setState({ value: result });
    }
}
