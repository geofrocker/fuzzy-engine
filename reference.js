recursive = data => {
  setTimeout(() => {
    console.log('were are running');
    let hasMore = this.state.numbers.numbers.length + 1 < data.numbers[0].numbers.length;
    this.setState((prev, props) => (
      console.log(prev),
      {
      numbers: {
        numbers:data.numbers[0].numbers.slice(0, prev.numbers.numbers.length + 50),
        total:data.numbers[0].total
      },
      currentNum: data.numbers[0].numbers[0],
      active: true,
      total: data.numbers[0].total
    }));
    if (hasMore) this.recursive();
  }, 0);
};