function Sort({ type, userData, setUserData }) {
    function sortFunc(e) {
        e.preventDefault();
        const key = e.target.value.toLowerCase();
        const sortData = [...userData].sort((a, b) => {
            let valueA = a[key];
            let valueB = b[key];
            if (key === "id") {
                valueA = Number(a.id);
                valueB = Number(b.id);
            } else if (key === "a-z") {
                valueA = a.title;
                valueB = b.title;
            }
            else if (key === "random") {
                return Math.random() - 0.5;
            }
            else if (key === "completed") {
                valueA = a.completed ? 0 : 1;
                valueB = b.completed ? 0 : 1;
            }
            if (valueA < valueB) return -1;
            if (valueA > valueB) return 1;
            return 0;
        });
        setUserData(sortData);
    }

    return (
        <>
            <select onChange={sortFunc}>
                <option value="" disabled selected>sort by</option>
                <option>ID</option>
                <option>a-z</option>
                <option>random</option>
                {type == "todos" && <option>completed</option>}
            </select>
        </>
    )
}

export default Sort;