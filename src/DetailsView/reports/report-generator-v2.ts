// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from '../../assessments/types/assessments-provider';
import { AssessmentStoreData } from '../../common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { TabStoreData } from '../../common/types/store-data/tab-store-data';
import { ScanResults } from '../../scanner/iruleresults';
import { AssessmentReportHtmlGenerator, AssessmentReportHtmlGeneratorDeps } from './assessment-report-html-generator';
import { ReportGenerator } from './report-generator';
import { ReportHtmlGenerator } from './report-html-generator';
import { ReportNameGenerator } from './report-name-generator';

export type ReportGeneratorDeps = AssessmentReportHtmlGeneratorDeps;

export class ReportGeneratorV2 implements ReportGenerator {
    constructor(
        private reportNameGenerator: ReportNameGenerator,
        // TODO we'll remove this tslint:disable comment after we implement the HTML report
        // tslint:disable-next-line:no-unused-variable
        private reportHtmlGenerator: ReportHtmlGenerator,
        private assessmentReportHtmlGenerator: AssessmentReportHtmlGenerator,
    ) {}

    public generateName(baseName: string, scanDate: Date, pageTitle: string): string {
        return this.reportNameGenerator.generateName(baseName, scanDate, pageTitle);
    }

    public generateFastPassAutomateChecksReport(
        scanResult: ScanResults,
        scanDate: Date,
        pageTitle: string,
        pageUrl: string,
        description: string,
    ): string {
        return '<html lang="en"><body>This will be the new automated checks report</body></html>';
    }

    public generateAssessmentReport(
        assessmentStoreData: AssessmentStoreData,
        assessmentsProvider: AssessmentsProvider,
        featureFlagStoreData: FeatureFlagStoreData,
        tabStoreData: TabStoreData,
        description: string,
    ): string {
        return this.assessmentReportHtmlGenerator.generateHtml(
            assessmentStoreData,
            assessmentsProvider,
            featureFlagStoreData,
            tabStoreData,
            description,
        );
    }
}
