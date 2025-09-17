import React, { useState, useEffect, useRef, CSSProperties } from 'react';

import './SolveViewWrapper.css';
import { HorizontalSplitView } from '@/common/presentations/HorizontalSplitView';
import { VerticalSplitView } from '@/common/presentations/VerticalSplitView';

type SolveViewWrapperProps = {
    problemDescriptionPanel: JSX.Element;
    solveEditorPanel: JSX.Element;
    solveEditorPanelTop: JSX.Element;
    testCasePanel: JSX.Element;
    footer: JSX.Element;
    height?: string | number;
    testCasePanelStyle?: CSSProperties;
};

const SolveViewWrapper: React.FC<SolveViewWrapperProps> = ({
    problemDescriptionPanel,
    solveEditorPanel,
    solveEditorPanelTop,
    testCasePanel,
    testCasePanelStyle,
    footer,
    height,
}) => {
    return (
        <>
            <div id='solve-view-wrapper'>
                <HorizontalSplitView
                    height={height || '100%'}
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
                                bottomStyle={testCasePanelStyle}
                            />
                        </div>
                    }
                />
                {footer}
            </div>
        </>
    );
};

export default SolveViewWrapper;
