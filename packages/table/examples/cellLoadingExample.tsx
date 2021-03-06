/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import { RadioGroup } from "@blueprintjs/core";
import BaseExample, { handleStringChange } from "@blueprintjs/core/examples/common/baseExample";

import { Cell, Column, Table } from "../src";

interface IBigSpaceRock {
    [key: string]: number | string;
}

// tslint:disable-next-line:no-var-requires
const bigSpaceRocks = require("./potentiallyHazardousAsteroids.json") as IBigSpaceRock[];

export type CellsLoadingConfiguration = "all"
    | "first-column"
    | "first-row"
    | "none"
    | "random";
export const CellsLoadingConfiguration = {
    ALL: "all" as CellsLoadingConfiguration,
    FIRST_COLUMN: "first-column" as CellsLoadingConfiguration,
    FIRST_ROW: "first-row" as CellsLoadingConfiguration,
    NONE: "none" as CellsLoadingConfiguration,
    RANDOM: "random" as CellsLoadingConfiguration,
};

const CONFIGURATIONS = [
    { label: "All cells", value: CellsLoadingConfiguration.ALL },
    { label: "First column", value: CellsLoadingConfiguration.FIRST_COLUMN },
    { label: "First row", value: CellsLoadingConfiguration.FIRST_ROW },
    { label: "Random", value: CellsLoadingConfiguration.RANDOM },
    { label: "None", value: CellsLoadingConfiguration.NONE },
];

export interface ICellLoadingExampleState {
   configuration?: CellsLoadingConfiguration;
   randomNumbers?: number[];
}

export class CellLoadingExample extends BaseExample<ICellLoadingExampleState> {
    public state: ICellLoadingExampleState = {
        configuration: CellsLoadingConfiguration.ALL,
    };

    protected className = "docs-cell-loading-example";

    private handleConfigurationChange = handleStringChange((configuration) => {
        if (configuration === CellsLoadingConfiguration.RANDOM) {
            // calculate random numbers just once instead of inside renderCell which is called during table scrolling
            const randomNumbers: number[] = [];
            const numberOfCells = bigSpaceRocks.length * Object.getOwnPropertyNames(bigSpaceRocks[0]).length;
            for (let i = 0; i < numberOfCells; i++) {
                randomNumbers.push(Math.random());
            }
            this.setState({ randomNumbers });
        }
        this.setState({ configuration: configuration as CellsLoadingConfiguration });
    });

    public renderExample() {
        return (
            <Table numRows={bigSpaceRocks.length}>
                {this.renderColumns()}
            </Table>
        );
    }

    protected renderOptions() {
        return (
            <RadioGroup
                label="Example cell loading configurations"
                selectedValue={this.state.configuration}
                options={CONFIGURATIONS}
                onChange={this.handleConfigurationChange}
            />
        );
    }

    private renderColumns() {
        const columns: JSX.Element[] = [];

        Object.getOwnPropertyNames(bigSpaceRocks[0]).forEach((columnName) => {
            const formattedColumnName = columnName
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (firstCharacter) => firstCharacter.toUpperCase());
            columns.push(<Column key={formattedColumnName} name={formattedColumnName} renderCell={this.renderCell} />);
        });

        return columns;
    }

    private renderCell = (rowIndex: number, columnIndex: number) => {
        const bigSpaceRock = bigSpaceRocks[rowIndex];
        return (
            <Cell loading={this.isLoading(rowIndex, columnIndex)}>
                {bigSpaceRock[Object.getOwnPropertyNames(bigSpaceRock)[columnIndex]]}
            </Cell>
        );
    }

    private isLoading = (rowIndex: number, columnIndex: number) => {
        switch (this.state.configuration) {
            case CellsLoadingConfiguration.ALL:
                return true;
            case CellsLoadingConfiguration.FIRST_COLUMN:
                return columnIndex === 0;
            case CellsLoadingConfiguration.FIRST_ROW:
                return rowIndex === 0;
            case CellsLoadingConfiguration.NONE:
                return false;
            case CellsLoadingConfiguration.RANDOM:
                const numColumns = Object.getOwnPropertyNames(bigSpaceRocks[0]).length;
                return this.state.randomNumbers[rowIndex * numColumns + columnIndex] > 0.4;
            default:
                throw new Error(`Unexpected value: ${this.state.configuration}`);
        }
    }
}
