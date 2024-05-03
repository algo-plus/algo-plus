const checkEnable = async () => {
    const enable = await getObjectFromLocalStorage('alpEnable');
    if (!enable) writeEnableMsgOnLog();
    return enable;
};

const writeEnableMsgOnLog = () => {
    const errMsg =
        '확장이 활성화되지 않았습니다. 확장을 활성화하고 시도해주세요';
    console.log(errMsg);
};
