import {
    isNull,
    isEmpty,
    filter,
    parseNumberFromString,
    convertSingleCharToDoubleChar,
    unescapeHtml,
} from '@/baekjoon/utils/utils';
import { RESULT_CATEGORY, languages, bj_level, uploadState } from './variables';
import {
    selectBestSubmissionList,
    convertResultTableHeader,
    convertImageTagAbsoluteURL,
    markUploadFailedCSS,
} from '@/baekjoon/utils/utils';
import { getDirNameByOrgOption } from '@/common/utils/storage';
import {
    updateProblemsFromStats,
    getProblemFromStats,
    getSolvedACFromStats,
    updateSolvedACFromStats,
} from '@/baekjoon/utils/storage/stats';

export const findData = async (data: any = null) => {
    try {
        if (isNull(data)) {
            let table: any = findFromResultTable();
            if (isEmpty(table)) return null;
            table = filter(table, {
                resultCategory: RESULT_CATEGORY.RESULT_ACCEPTED,
                username: findUsername(),
                language: table[0]['language'],
            });
            data = selectBestSubmissionList(table)[0];
        }
        if (isNaN(Number(data.problemId)) || Number(data.problemId) < 1000)
            throw new Error(
                `정책상 대회 문제는 업로드 되지 않습니다. 대회 문제가 아니라고 판단된다면 이슈로 남겨주시길 바랍니다.\n문제 ID: ${data.problemId}`
            );
        data = {
            ...data,
            ...(await findProblemInfoAndSubmissionCode(
                data.problemId,
                data.submissionId
            )),
        };
        const detail = await makeDetailMessageAndReadme(data);
        return { ...data, ...detail };
    } catch (error) {
        console.error(error);
    }
    return null;
};

const makeDetailMessageAndReadme = async (data: any) => {
    const {
        problemId,
        result,
        title,
        level,
        problem_tags,
        problem_description,
        problem_input,
        problem_output,
        language,
    } = data;
    const score = parseNumberFromString(result);
    const directory = await getDirNameByOrgOption(
        `백준/${level.replace(
            / .*/,
            ''
        )}/${problemId}. ${convertSingleCharToDoubleChar(title)}`,
        langVersionRemove(language, null)
    );
    const message =
        `[${level}] Title: ${title}` +
        (isNaN(score) ? ' ' : `, Score: ${score} point `) +
        `AlgoPlus`;
    const category = problem_tags.join(', ');
    const fileName = `${convertSingleCharToDoubleChar(title)}.${
        languages[language]
    }`;

    const readme =
        `# [${level}] ${title} - ${problemId} \n\n` +
        `[문제 링크](https://www.acmicpc.net/problem/${problemId}) \n\n` +
        `### 분류\n\n` +
        `${category || 'Empty'}\n\n` +
        (!!problem_description
            ? '' +
              `### 문제 설명\n\n${problem_description}\n\n` +
              `### 입력 \n\n ${problem_input}\n\n` +
              `### 출력 \n\n ${problem_output}\n\n`
            : '');

    return {
        directory,
        fileName,
        message,
        readme,
    };
};

export const findUsername = () => {
    const el: any = document.querySelector('a.username');
    if (isNull(el)) return null;
    const username = el?.innerText?.trim();
    if (isEmpty(username)) return null;
    return username;
};

export const findUsernameOnUserInfoPage = () => {
    const el: any = document.querySelector('div.page-header > h1');
    if (isNull(el)) return null;
    const username = el.textContent.trim();
    if (isEmpty(username)) return null;
    return username;
};

export const isExistResultTable = () => {
    return document.getElementById('status-table') !== null;
};

export const parsingResultTableList = (doc: any) => {
    const table = doc.getElementById('status-table');
    if (table === null || table === undefined || table.length === 0) return [];
    const headers = Array.from(table.rows[0].cells, (x: any) =>
        convertResultTableHeader(x.innerText.trim())
    );

    const list = [];
    for (let i = 1; i < table.rows.length; i++) {
        const row = table.rows[i];
        const cells = Array.from(row.cells, (x: any, index) => {
            switch (headers[index]) {
                case 'result':
                    return {
                        result: x.innerText.trim(),
                        resultCategory: x.firstChild
                            .getAttribute('data-color')
                            .replace('-eng', '')
                            .trim(),
                    };
                case 'language':
                    return x.innerText
                        .unescapeHtml()
                        .replace(/\/.*$/g, '')
                        .trim();
                case 'submissionTime':
                    const el = x.querySelector('a.show-date');
                    if (isNull(el)) return null;
                    return el.getAttribute('data-original-title');
                case 'problemId':
                    const a = x.querySelector('a.problem_title');
                    if (isNull(a)) return null;
                    return {
                        problemId: a
                            .getAttribute('href')
                            .replace(/^.*\/([0-9]+)$/, '$1'),
                    };
                default:
                    return x.innerText.trim();
            }
        });
        let obj: any = {};
        obj.elementId = row.id;
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = cells[j];
        }
        obj = { ...obj, ...obj.result, ...obj.problemId };
        list.push(obj);
    }
    return list;
};

export const findFromResultTable = () => {
    if (!isExistResultTable()) {
        console.log('Result table not found');
    }
    return parsingResultTableList(document);
};

export const parseProblemDescription = (doc: any = document) => {
    convertImageTagAbsoluteURL(doc.getElementById('problem_description'));
    const problemId = doc
        .getElementsByTagName('title')[0]
        .textContent.split(':')[0]
        .replace(/[^0-9]/, '');
    const problem_description = unescapeHtml(
        doc.getElementById('problem_description').innerHTML.trim()
    );
    const problem_input =
        doc
            .getElementById('problem_input')
            ?.innerHTML.trim?.()
            .unescapeHtml?.() || 'Empty';
    const problem_output =
        doc
            .getElementById('problem_output')
            ?.innerHTML.trim?.()
            .unescapeHtml?.() || 'Empty';
    if (problemId && problem_description) {
        updateProblemsFromStats({
            problemId,
            problem_description,
            problem_input,
            problem_output,
        });
        return {
            problemId,
            problem_description,
            problem_input,
            problem_output,
        };
    }
    return {};
};

export const fetchProblemDescriptionById = async (problemId: any) => {
    return fetch(`https://www.acmicpc.net/problem/${problemId}`)
        .then((res) => res.text())
        .then((html) => {
            const doc = new DOMParser().parseFromString(html, 'text/html');
            return parseProblemDescription(doc);
        });
};

export const fetchSolvedACById = async (problemId: any) => {
    return chrome.runtime.sendMessage({
        sender: 'baekjoon',
        task: 'SolvedApiCall',
        problemId: problemId,
    });
};

const getProblemDescriptionById = async (problemId: any) => {
    let problem = await getProblemFromStats(problemId);
    if (isNull(problem)) {
        problem = await fetchProblemDescriptionById(problemId);
        updateProblemsFromStats(problem);
    }
    return problem;
};

const getSolvedACById = async (problemId: any) => {
    let jsonData = await getSolvedACFromStats(problemId);
    if (isNull(jsonData)) {
        jsonData = await fetchSolvedACById(problemId);
        updateSolvedACFromStats({ problemId, jsonData });
    }
    return jsonData;
};

const findProblemInfoAndSubmissionCode = async (
    problemId: any,
    submissionId: any
) => {
    if (!isNull(problemId) && !isNull(submissionId)) {
        return Promise.all([
            getProblemDescriptionById(problemId),
            getSolvedACById(problemId),
        ])
            .then(([description, solvedJson]) => {
                const problem_tags = solvedJson.tags
                    .flatMap((tag: any) => tag.displayNames)
                    .filter((tag: any) => tag.language === 'ko')
                    .map((tag: any) => tag.name);
                const title = solvedJson.titleKo;
                const level = bj_level[solvedJson.level];

                const { problem_description, problem_input, problem_output } =
                    description;
                return {
                    problemId,
                    submissionId,
                    title,
                    level,
                    problem_description,
                    problem_input,
                    problem_output,
                    problem_tags,
                };
            })
            .catch((err) => {
                console.log('error ocurred: ', err);
                uploadState.uploading = false;
                markUploadFailedCSS();
            });
    }
};

const langVersionRemove = (lang: string, ignores: any): string => {
    if (ignores === null || !ignores.has(lang)) {
        let parts = lang.split(' ');
        if (/^\d/.test(parts[parts.length - 1])) {
            parts.pop();
        }
        lang = parts.join(' ');
    }

    return lang;
};
