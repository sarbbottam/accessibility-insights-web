// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { clone, forEach, size } from 'lodash';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

import { BaseStore } from '../../../../../common/base-store';
import { BaseClientStoresHub } from '../../../../../common/stores/base-client-stores-hub';
import { StoreMock } from '../../../mock-helpers/store-mock';

describe('BaseClientStoresHubTest', () => {
    let store1Mock: StoreMock<TestStoreData>;
    let store2Mock: StoreMock<TestStoreData>;
    let store3Mock: StoreMock<TestStoreData>;

    beforeEach(() => {
        store1Mock = new StoreMock<TestStoreData>();
        store2Mock = new StoreMock<TestStoreData>();
        store3Mock = new StoreMock<TestStoreData>();
    });

    test('addChangedListenerToAllStores', () => {
        const listenerMock = createListenerMock(Times.exactly(3));
        setupAddChangedListeners();
        const testObject = createDefaultClientStoreHub();

        testObject.addChangedListenerToAllStores(listenerMock.object);

        invokeChangedListeners();
        listenerMock.verifyAll();
    });

    test('addChangedListenerToAllStores (no stores)', () => {
        const listenerMock = createListenerMock(Times.never());
        setupAddChangedListeners();
        const testObject = createDefaultClientStoreHub();
        testObject.stores = null;

        testObject.addChangedListenerToAllStores(listenerMock.object);

        invokeChangedListeners();
        listenerMock.verifyAll();
    });

    test('removeChangedListenerFromAllStores', () => {
        const listenerMock = Mock.ofInstance(() => {}, MockBehavior.Strict);
        setupRemoveChangedListeners(1);
        const testObject = createDefaultClientStoreHub();

        testObject.removeChangedListenerFromAllStores(listenerMock.object);

        verifyAllStoreMocks();
    });

    test('removeChangedListenerFromAllStores (no stores)', () => {
        const listenerMock = Mock.ofInstance(() => {}, MockBehavior.Strict);
        setupRemoveChangedListeners(0);
        const testObject = createDefaultClientStoreHub();
        testObject.stores = null;

        testObject.removeChangedListenerFromAllStores(listenerMock.object);

        verifyAllStoreMocks();
    });

    test('hasStore when no store is null', () => {
        const testObject = createDefaultClientStoreHub();

        expect(testObject.hasStores()).toBe(true);
    });

    test('hasStores when stores array is null', () => {
        const testObject = createDefaultClientStoreHub();
        testObject.stores = null;

        expect(testObject.hasStores()).toBe(false);
    });

    test('hasStores with stores being null (several scenarios)', () => {
        const constructorArgs = getConstructorArgsForHasStoresReturningFalse();

        forEach(constructorArgs, (args: BaseStore<TestStoreData>[], index: number) => {
            const testObject = buildClientStoresHub(args);

            expect(testObject.hasStores()).toBe(false);
        });
    });

    test('hasStoreData: all stores has data', () => {
        const testObject = createDefaultClientStoreHub();
        store1Mock.setupGetState({});
        store2Mock.setupGetState({});
        store3Mock.setupGetState({});
        expect(testObject.hasStoreData()).toBe(true);
    });

    test('hasStoreData: a stores has null data', () => {
        const testObject = createDefaultClientStoreHub();
        store1Mock.setupGetState({});
        store2Mock.setupGetState({});
        store3Mock.setupGetState(null);
        expect(testObject.hasStoreData()).toBe(false);
    });

    test('getAllStoreData: return null if not all store is ready', () => {
        const testObject = createDefaultClientStoreHub();
        testObject.stores = [store1Mock.getObject(), null];
        store1Mock.setupGetState({});
        store1Mock.setupGetId('store1Mock');
        store2Mock.setupGetState({});
        store2Mock.setupGetId('store2Mock');
        expect(testObject.getAllStoreData()).toBe(null);
    });

    test('getAllStoreData: all store is ready', () => {
        const store1State = {};
        const testObject = createDefaultClientStoreHub();
        testObject.stores = [store1Mock.getObject(), store2Mock.getObject()];
        store1Mock.setupGetState(store1State);
        store1Mock.setupGetId('store1');
        store2Mock.setupGetState(null);
        store2Mock.setupGetId('store2');
        const expected = {
            store1Data: store1State,
            store2Data: null,
        };
        expect(testObject.getAllStoreData()).toMatchObject(expected);
    });

    function createListenerMock(times: Times): IMock<() => void> {
        const listenerMock = Mock.ofInstance(() => {}, MockBehavior.Strict);
        listenerMock.setup(l => l()).verifiable(times);

        return listenerMock;
    }

    function setupAddChangedListeners(): void {
        store1Mock.setupAddChangedListener();
        store2Mock.setupAddChangedListener();
        store3Mock.setupAddChangedListener();
    }

    function createDefaultClientStoreHub(): BaseClientStoresHub<TestStoreData> {
        return new BaseClientStoresHub([store1Mock.getObject(), store2Mock.getObject(), store3Mock.getObject()]);
    }

    function invokeChangedListeners(): void {
        store1Mock.invokeChangeListener();
        store2Mock.invokeChangeListener();
        store3Mock.invokeChangeListener();
    }

    function setupRemoveChangedListeners(times: number): void {
        store1Mock.setupRemoveListener(times);
        store2Mock.setupRemoveListener(times);
        store3Mock.setupRemoveListener(times);
    }

    function verifyAllStoreMocks(): void {
        store1Mock.verifyAll();
        store2Mock.verifyAll();
        store3Mock.verifyAll();
    }

    function getConstructorArgsForHasStoresReturningFalse(): BaseStore<TestStoreData>[][] {
        const argsPrototype: BaseStore<TestStoreData>[] = [store1Mock.getObject(), store2Mock.getObject(), store3Mock.getObject()];

        const argsLength = size(argsPrototype);

        const result: BaseStore<TestStoreData>[][] = [];

        const falseReturningCombination = Math.pow(2, argsLength) - 1; // last combination will have all the stores

        for (let combinationIndex = 0; combinationIndex < falseReturningCombination; combinationIndex++) {
            const combinationArgs: BaseStore<any>[] = clone(argsPrototype);

            for (let bitmaskPow = 0; bitmaskPow < argsLength; bitmaskPow++) {
                const bitmask = Math.pow(2, bitmaskPow);

                // tslint:disable-next-line:no-bitwise
                if (!(combinationIndex & bitmask)) {
                    combinationArgs[bitmaskPow] = null;
                }
            }

            result.push(combinationArgs);
        }

        return result;
    }

    function buildClientStoresHub(stores: BaseStore<TestStoreData>[]): BaseClientStoresHub<TestStoreData> {
        const builder: (stores) => BaseClientStoresHub<TestStoreData> = theStores => {
            function ClientStoresHubFake(): void {
                // tslint:disable-next-line: no-invalid-this
                BaseClientStoresHub.call(this, theStores);
            }
            ClientStoresHubFake.prototype = BaseClientStoresHub.prototype;
            return new ClientStoresHubFake();
        };

        return builder(stores);
    }
});

interface TestStoreData {}
