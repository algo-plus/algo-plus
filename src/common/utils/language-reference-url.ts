import { ReferenceLanguage } from '@/common/types/language';

const referenceUrl: Record<ReferenceLanguage, string> = {
    c11: 'https://en.cppreference.com/w/c/11',
    c99: 'https://en.cppreference.com/w/c/99',
    cpp17: 'https://en.cppreference.com/w/cpp/17',
    cpp20: 'https://en.cppreference.com/w/cpp/20',
    csharp: 'https://learn.microsoft.com/en-us/dotnet/api/?view=netframework-4.6.2&preserve-view=true',
    java8: 'https://docs.oracle.com/javase/8/docs/api/index.html',
    java11: 'https://docs.oracle.com/javase/11/docs/api/index.html',
    python: 'https://docs.python.org/3/index.html',
    pypy: 'https://doc.pypy.org/en/latest/man/pypy3.1.html',
    js: 'https://nodejs.org/docs/latest-v12.x/api/',
    kotlin: 'https://kotlinlang.org/api/latest/jvm/stdlib/',
    ruby: 'https://ruby-doc.org/3.1.2/',
    swift: 'https://developer.apple.com/documentation/swift/swift-standard-library',
    go: 'https://pkg.go.dev/std',
};

export const getReferenceUrl = (language: ReferenceLanguage): string => {
    return referenceUrl[language];
};
