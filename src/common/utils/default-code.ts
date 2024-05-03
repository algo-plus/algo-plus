import { EditorLanguage } from '@/common/types/language';

const defaultCode: Record<EditorLanguage, string> = {
    c: '#include <stdio.h>\n\nint main()\n{\n    // 코드를 작성해주세요\n    return 0;\n}\n',
    cpp: '#include <iostream>\n\nusing namespace std;\n\nint main() \n{\n    // 코드를 작성해주세요\n    return 0;\n}\n',
    csharp: 'namespace HelloWorld\n{\n    public class Program\n        {\n	    public static void Main(string[] args)\n        {\n          // 코드를 작성해주세요\n        }\n    }\n}\n',
    java: 'public class Main {\n    public static void main(String[] args) {\n        // 코드를 작성해주세요\n    }\n}\n',
    python: '# 코드를 작성해주세요\n',
    js: '// 코드를 작성해주세요\n',
    kotlin: 'fun main(args: Array<String>) {\n    // 코드를 작성해주세요\n}\n',
    ruby: '# 코드를 작성해주세요\n',
    swift: '// 코드를 작성해주세요\n',
    go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // 코드를 작성해주세요\n}\n',
};

const getDefaultCode = (language: EditorLanguage): string => {
    return defaultCode[language];
};

export { getDefaultCode };
