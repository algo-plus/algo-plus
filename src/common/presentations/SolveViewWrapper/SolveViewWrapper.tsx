import React, { useState, useEffect, useRef } from 'react';

import './SolveViewWrapper.css';
import { HorizontalSplitView } from '@/common/presentations/HorizontalSplitView';
import { VerticalSplitView } from '@/common/presentations/VerticalSplitView';

type SolveViewWrapperProps = {
    problemDescriptionPanel: JSX.Element;
    solveEditorPanel: JSX.Element;
    solveEditorPanelTop: JSX.Element;
    testCasePanel: JSX.Element;
};

const SolveViewWrapper: React.FC<SolveViewWrapperProps> = ({
    problemDescriptionPanel,
    solveEditorPanel,
    solveEditorPanelTop,
    testCasePanel,
}) => {
    return (
        <>
            <div id='solve-view-wrapper'>
                <HorizontalSplitView
                    left={problemDescriptionPanel}
                    right={
                        <div
                            style={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '5px',
                            }}
                        >
                            {solveEditorPanelTop}
                            <VerticalSplitView
                                top={solveEditorPanel}
                                bottom={testCasePanel}
                            />
                        </div>
                    }
                />
            </div>
        </>
    );
};

export default SolveViewWrapper;
