// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CreateIssueDetailsTextData } from '../../../../../common/types/create-issue-details-text-data';
import { DecoratedAxeNodeResult } from '../../../../../injected/scanner-utils';
import { IssueFilingUrlStringUtils } from './../../../../../issue-filing/common/issue-filing-url-string-utils';

describe('IssueFilingUrlStringUtilsTest', () => {
    let sampleIssueDetailsData: CreateIssueDetailsTextData;

    beforeEach(() => {
        sampleIssueDetailsData = {
            pageTitle: 'pageTitle<x>',
            pageUrl: 'pageUrl',
            ruleResult: {
                failureSummary: 'RR-failureSummary',
                guidanceLinks: [{ text: 'WCAG-1.4.1' }, { text: 'wcag-2.8.2' }],
                help: 'RR-help',
                html: 'RR-html',
                ruleId: 'RR-rule-id',
                helpUrl: 'RR-help-url',
                selector: 'RR-selector<x>',
                snippet: 'RR-snippet   space',
            } as DecoratedAxeNodeResult,
        };
    });

    describe('getTitle', () => {
        test('with tags', () => {
            expect(IssueFilingUrlStringUtils.getTitle(sampleIssueDetailsData)).toMatchSnapshot();
        });

        test('without tags', () => {
            sampleIssueDetailsData.ruleResult.guidanceLinks = [];
            expect(IssueFilingUrlStringUtils.getTitle(sampleIssueDetailsData)).toMatchSnapshot();
        });
    });

    test('getSelectorLastPart', () => {
        expect(IssueFilingUrlStringUtils.getSelectorLastPart('hello world')).toEqual('hello world');
        expect(IssueFilingUrlStringUtils.getSelectorLastPart('hello > world')).toEqual('world');
    });

    test('standardizeTags', () => {
        const expected = ['WCAG-1.4.1', 'WCAG-2.8.2'];
        expect(IssueFilingUrlStringUtils.standardizeTags(sampleIssueDetailsData)).toEqual(expected);
    });
});
