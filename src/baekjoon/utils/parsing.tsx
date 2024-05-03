import React from 'react';
import { TestCase } from '@/baekjoon/types/problem';
import uuid from 'react-uuid';

export const getProblemId = (): string | null => {
    const problemIdElement = document.querySelector(
        'ul.problem-menu li a[href*="/problem"]'
    );

    if (problemIdElement && problemIdElement.textContent) {
        const match = problemIdElement.textContent.match(/(\d+)번/);
        if (match) return match[1];
    }

    const urlParams = new URLSearchParams(window.location.search);
    const problemId = urlParams.get('problem_id');
    if (problemId) return problemId;

    const pathIdMatch = window.location.pathname.split('/');
    if (pathIdMatch) return pathIdMatch[pathIdMatch.length - 1];

    console.error('문제 번호 가져오기 실패!');
    return null;
};

export const parsingProblemDetail = (html: string): JSX.Element => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const problemContainer = doc.querySelector(
        '.container.content .row'
    ) as HTMLElement;

    if (problemContainer) {
        const elementsToRemove = [
            'ul.problem-menu',
            '.problem-button',
            '#problem_tags',
            '#problem_memo',
        ];

        elementsToRemove.forEach((selector) => {
            const elem = problemContainer.querySelector(selector);
            if (elem && elem.parentNode) {
                elem.parentNode.removeChild(elem);
            }
        });

        const copyButtons = problemContainer.querySelectorAll('.copy-button');
        copyButtons.forEach(function (button) {
            button.parentNode?.removeChild(button);
        });

        problemContainer.style.margin = '0';

        return (
            <div
                className='problem-content'
                dangerouslySetInnerHTML={{
                    __html: problemContainer.innerHTML,
                }}
            ></div>
        );
    } else {
        return <h1>문제를 불러오는데 실패했습니다.</h1>;
    }
};

export const parsingStyle = (html: string): JSX.Element => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const style = doc.querySelector('style');

    if (style) {
        return <style>{style.textContent}</style>;
    } else {
        return <style>{''}</style>;
    }
};

export const parsingTestCases = (html: string): TestCase[] => {
    const testCases: TestCase[] = [];
    const doc = new DOMParser().parseFromString(html, 'text/html');

    const inputs = doc.querySelectorAll('[id^="sample-input-"]');
    const outputs = doc.querySelectorAll('[id^="sample-output-"]');
    const count = inputs.length;
    for (let i = 0; i < count; ++i) {
        testCases.push({
            uuid: uuid(),
            input: (inputs[i].textContent as string).trim(),
            output: (outputs[i].textContent as string).trim(),
        });
    }
    return testCases;
};
