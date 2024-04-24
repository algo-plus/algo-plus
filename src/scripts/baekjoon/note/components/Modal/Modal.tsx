import React from 'react';
import * as Diff from 'diff';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';
import './Modal.css';

const Modal = () => {
    const closeModal = () => {
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
            modalBackdrop.remove();
        }
        console.log('close modal');
    };
    const save = () => {
        console.log('save');
    };

    // const CodeDiff: React.FC<CodeDiffProps> = ({ oldCode, newCode }) => {
    //     const generateDiff = () => {
    //         const diff = Diff.diffLines(oldCode, newCode);
    //         return diff.map((part, index) => {
    //             if (part.added) {
    //                 return (
    //                     <span
    //                         key={index}
    //                         style={{ backgroundColor: 'lightgreen' }}
    //                     >
    //                         + {part.value}
    //                     </span>
    //                 );
    //             }
    //             if (part.removed) {
    //                 return (
    //                     <span
    //                         key={index}
    //                         style={{ backgroundColor: 'lightcoral' }}
    //                     >
    //                         - {part.value}
    //                     </span>
    //                 );
    //             }
    //             return <span key={index}>{part.value}</span>;
    //         });
    //     };

    //     return <div>{generateDiff()}</div>;
    // };

    const oldCode: string = `import java.io.BufferedReader;
    import java.io.IOException;
    import java.io.InputStreamReader;
    
    public class Main {
        private static int N, M;
        private static char[][] graph;
        private static boolean[][] visited;
        private static int ans = Integer.MIN_VALUE;
        private static int[] dx = { 0, 1, 0, -1 };
        private static int[] dy = { 1, 0, -1, 0 };
        public static void main(String[] args) throws IOException {
            BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
            N = read();
            M = read();
            graph = new char[N][M];
            visited = new boolean[N][M];
    
            String line;
            for (int i = 0; i < N; i++) {
                line = br.readLine();
                for (int j = 0; j < M; j++) {
                    graph[i][j] = line.charAt(j);
                }
            }
            dfs(0, 0, 1);
            System.out.println(ans);
        }
    
        private static void dfs(int r, int c, int cnt) {
            if (visited[r][c]) {
                System.out.println(-1);
                System.exit(0);
            }
            visited[r][c] = true;
            int nr, nc, len;
            for (int i = 0; i < 4; i++) {
                len = graph[r][c] - '0';
                nr = r + len * dx[i];
                nc = c + len * dy[i];
                if (nr < 0 || nr >= N || nc < 0 || nc >= M || graph[nr][nc] == 'H')
                    continue;
                dfs(nr, nc, cnt + 1);
                visited[nr][nc] = false;
            }
            ans = Math.max(ans, cnt);
            return;
        }
        static int read() throws IOException {
            int c, n = System.in.read() & 15;
            while ((c = System.in.read()) > 32)
                n = (n << 3) + (n << 1) + (c & 15);
            if (c == 13)
                System.in.read();
            return n;
        }
    }`;

    const newCode: string = `import java.io.BufferedReader;
    import java.io.IOException;
    import java.io.InputStreamReader;
    import java.util.Arrays;
    
    public class Main {
        private static int N, M;
        private static char[][] graph;
        private static int[][] dp;
        private static boolean[][] visited;
        private static int tmp;
        private static int[] dx = { 0, 1, 0, -1 };
        private static int[] dy = { 1, 0, -1, 0 };
    
        public static void main(String[] args) throws IOException {
            BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
            N = read();
            M = read();
            graph = new char[N][M];
            dp = new int[N][M];
            visited = new boolean[N][M];
    
            String line;
            for (int i = 0; i < N; i++) {
                line = br.readLine();
                Arrays.fill(dp[i], -1);
                graph[i] = line.toCharArray();
            }
            System.out.println(dfs(0, 0) + 1);
        }
    
        private static int dfs(int r, int c) {
            if (visited[r][c]) {
                System.out.println(-1);
                System.exit(0);
            }
            if (dp[r][c] > -1) {
                return dp[r][c];
            }
            visited[r][c] = true;
            dp[r][c] = 0;
            int nr, nc, len;
            for (int i = 0; i < 4; i++) {
                len = graph[r][c] - '0';
                nr = r + len * dx[i];
                nc = c + len * dy[i];
                if (nr < 0 || nr >= N || nc < 0 || nc >= M || graph[nr][nc] == 'H')
                    continue;
                tmp = dfs(nr, nc) + 1;
                dp[r][c] = tmp > dp[r][c] ? tmp : dp[r][c];
                visited[nr][nc] = false;
            }
            return dp[r][c];
        }
    
        static int read() throws IOException {
            int c, n = System.in.read() & 15;
            while ((c = System.in.read()) > 32)
                n = (n << 3) + (n << 1) + (c & 15);
            if (c == 13)
                System.in.read();
            return n;
        }
    }`;

    // TODO: Adjust margin and padding of ReactDiffViewer
    return (
        <div className='modal-content'>
            <div className='modal-header' style={{ display: 'flex' }}>
                <h5 className='modal-title'>오답 노트 작성</h5>
                <button
                    type='button'
                    className='close'
                    data-dismiss='modal'
                    aria-label='Close'
                    onClick={closeModal}
                >
                    <span aria-hidden='true'>&times;</span>
                </button>
            </div>
            <div className='modal-body'>
                <div className='codediff-container'>
                    <h6>코드 비교 결과:</h6>
                    {/* <pre>
                        <CodeDiff oldCode={oldCode} newCode={newCode} />
                    </pre> */}
                    <ReactDiffViewer
                        oldValue={oldCode}
                        newValue={newCode}
                        compareMethod={DiffMethod.LINES}
                        splitView={true}
                    />
                </div>
                <div>
                    <h6>전체 코멘트</h6>
                    <textarea rows={4} cols={50}></textarea>
                </div>
            </div>
            <div className='modal-footer'>
                <button
                    type='button'
                    className='btn btn-secondary'
                    data-dismiss='modal'
                    onClick={closeModal}
                >
                    취소
                </button>
                <button
                    type='button'
                    className='btn btn-primary'
                    onClick={save}
                >
                    저장
                </button>
            </div>
        </div>
    );
};

export default Modal;
