const polling = (): void => {
    console.log('polling');
    setTimeout(polling, 1000);
};

polling();
