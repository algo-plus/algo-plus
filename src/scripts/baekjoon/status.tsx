import { Modal } from './note/components/Modal';

const customStatusPage = (): void => {
    const table = document.querySelector('#status-table');
    if (!table) return;
    const tableHead = table.querySelector('thead');
    if (!tableHead) return;
    const tableBody = table.querySelector('tbody');
    if (!tableBody) return;

    const column = tableHead.querySelectorAll('tr');

    const headerCell = document.createElement('th');
    headerCell.textContent = '오답';
    headerCell.style.width = '5%';

    column[0].insertBefore(headerCell, column[0].firstChild);
    const rows = tableBody.querySelectorAll('tr');

    // 오답 체크박스
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];

        const checkboxCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('note-checkbox');
        checkboxCell.appendChild(checkbox);

        row.insertBefore(checkboxCell, row.firstChild);
    }

    // TODO: Checkbox 코드 선택 기능 추가
    const checkboxes = document.querySelectorAll('.note-checkbox');
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('click', () => {
            let checkedCount = 0;
            checkboxes.forEach((cb) => {
                let checked = cb as HTMLInputElement;
                if (checked.checked) {
                    checkedCount++;
                }
            });
            if (checkedCount > 2) {
                (checkbox as HTMLInputElement).checked = false;
            }
        });
    });

    // 오답노트 작성 버튼
    const button = document.createElement('button');
    button.textContent = '오답 노트 작성';
    button.classList.add('btn', 'btn-primary');
    button.addEventListener('click', () => {
        Modal();
    });

    // FIX: 오답 노트 작성 버튼 위치 고정해야함
    const anchor = document.querySelectorAll('.text-center');
    if (anchor) {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.appendChild(button);
        anchor[2].insertBefore(container, anchor[2].firstChild);
    }
};

export default customStatusPage;
