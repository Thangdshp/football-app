// Danh sách cầu thủ và tier (Admin nhập vào)]
const localStorage = window.localStorage;

let players = JSON.parse(localStorage.getItem('players')) || [];
let teams = { A: [], B: [] };
let goals = {};

// Hàm thêm cầu thủ và Tier từ Admin
function addPlayerToList() {
    const playerName = document.getElementById('adminPlayerName').value.trim();
    const playerTier = document.getElementById('adminPlayerTier').value.trim();

    if (playerName && playerTier) {
        const playerExists = players.find(player => player.name === playerName);
        if (!playerExists) {
            players.push({ name: playerName, tier: playerTier, attended: false });
            updateAdminPlayerList();
            localStorage.setItem('players', JSON.stringify(players)); // Lưu dữ liệu cầu thủ
        } else {
            alert("Player already exists!");
        }
    } else {
        alert("Please enter both name and tier!");
    }

    // Clear input fields
    document.getElementById('adminPlayerName').value = '';
    document.getElementById('adminPlayerTier').value = '';
}

// Hàm cập nhật danh sách cầu thủ cho Admin
function updateAdminPlayerList() {
    const adminPlayerListBody = document.getElementById('adminPlayerList').getElementsByTagName('tbody')[0];
    adminPlayerListBody.innerHTML = ''; // Clear the table body

    players.forEach(player => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        const tierCell = document.createElement('td');

        nameCell.textContent = player.name;
        tierCell.textContent = player.tier;

        row.appendChild(nameCell);
        row.appendChild(tierCell);
        adminPlayerListBody.appendChild(row);
    });

    // Update player select options for editing
    updatePlayerSelect();
}

// Hàm cập nhật dropdown chọn cầu thủ để sửa thông tin
function updatePlayerSelect() {
    const playerSelect = document.getElementById('playerSelect');
    playerSelect.innerHTML = '<option value="">Select Player to Edit</option>'; // Clear existing options

    players.forEach(player => {
        const option = document.createElement('option');
        option.value = player.name;
        option.textContent = player.name;
        playerSelect.appendChild(option);
    });
}

// Hàm chọn cầu thủ để sửa thông tin
function selectPlayerForEdit() {
    const selectedPlayerName = document.getElementById('playerSelect').value;
    const player = players.find(p => p.name === selectedPlayerName);
    
    if (player) {
        document.getElementById('editPlayerName').value = player.name;
        document.getElementById('editPlayerTier').value = player.tier;
    }
}

// Hàm cập nhật thông tin cầu thủ
function updatePlayerInfo() {
    const playerName = document.getElementById('playerSelect').value;
    const newPlayerName = document.getElementById('editPlayerName').value.trim();
    const newPlayerTier = document.getElementById('editPlayerTier').value.trim();

    if (newPlayerName && newPlayerTier) {
        const player = players.find(p => p.name === playerName);
        if (player) {
            player.name = newPlayerName;
            player.tier = newPlayerTier;
            updateAdminPlayerList();
            localStorage.setItem('players', JSON.stringify(players)); // Lưu dữ liệu đã sửa
        }
    } else {
        alert("Please enter both name and tier!");
    }
}

// Hàm điểm danh cầu thủ
function markAttendance(playerName) {
    const player = players.find(p => p.name === playerName);
    if (player) {
        player.attended = !player.attended; // Toggle attendance
        updateAttendanceList();
        localStorage.setItem('players', JSON.stringify(players)); // Lưu trạng thái điểm danh
    }
}

// Hàm cập nhật danh sách điểm danh
function updateAttendanceList() {
    const attendanceList = document.getElementById('attendanceList');
    attendanceList.innerHTML = ''; // Xóa danh sách hiện tại

    players.forEach(player => {
        const li = document.createElement('li');
        li.textContent = `${player.name} - Tier: ${player.tier}`;
        
        // Thêm nút điểm danh cho mỗi cầu thủ
        const attendanceButton = document.createElement('button');
        attendanceButton.textContent = player.attended ? 'Attended' : 'Not Attended';
        attendanceButton.onclick = () => markAttendance(player.name); // Khi nhấn, toggle điểm danh
        li.appendChild(attendanceButton);
        
        attendanceList.appendChild(li); // Thêm vào danh sách
    });
}

// Hàm chia đội
function generateTeams() {
    // Clear previous teams
    teams.A = [];
    teams.B = [];

    // Sắp xếp cầu thủ theo Tier
    const tierAPlayers = players.filter(player => player.tier === 'A');
    const tierBPlayers = players.filter(player => player.tier === 'B');
    const tierCPlayers = players.filter(player => player.tier === 'C');

    // Xáo trộn các cầu thủ trong mỗi Tier để tạo đội ngẫu nhiên
    const sortedPlayers = [...tierAPlayers, ...tierBPlayers, ...tierCPlayers];
    sortedPlayers.sort(() => Math.random() - 0.5); // Shuffle players randomly

    // Phân chia đội
    sortedPlayers.forEach((player, index) => {
        if (index % 2 === 0) {
            teams.A.push(player);
        } else {
            teams.B.push(player);
        }
    });

    updateTeamList();
}

// Cập nhật danh sách đội
function updateTeamList() {
    const teamAList = document.getElementById('teamAList');
    const teamBList = document.getElementById('teamBList');
    teamAList.innerHTML = '';
    teamBList.innerHTML = '';

    teams.A.forEach(player => {
        const li = document.createElement('li');
        li.textContent = player.name;
        teamAList.appendChild(li);
    });

    teams.B.forEach(player => {
        const li = document.createElement('li');
        li.textContent = player.name;
        teamBList.appendChild(li);
    });
}

// Cập nhật bảng xếp hạng
function updateLeaderboard(player, goalsScored) {
    if (!goals[player]) {
        goals[player] = 0;
    }
    goals[player] += goalsScored;

    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = '';
    const sortedLeaderboard = Object.entries(goals).sort((a, b) => b[1] - a[1]);
    sortedLeaderboard.forEach(([player, goalsScored]) => {
        const li = document.createElement('li');
        li.textContent = `${player}: ${goalsScored} goals`;
        leaderboardList.appendChild(li);
    });
}

// Hàm hiển thị tab
function showTab(tabId) {
    const tabContents = document.querySelectorAll('.tab-content');
    const tabButtons = document.querySelectorAll('.tab-button');

    // Ẩn tất cả tab
    tabContents.forEach(content => content.classList.remove('active'));
    tabButtons.forEach(button => button.classList.remove('active'));

    // Hiển thị tab được chọn
    document.getElementById(tabId).classList.add('active');
    const activeButton = Array.from(tabButtons).find(button => button.textContent.toLowerCase() === tabId.replace('-', ' '));
    activeButton.classList.add('active');
}

// Khởi tạo ban đầu
document.addEventListener('DOMContentLoaded', () => {
    updateAdminPlayerList();
    updateAttendanceList();
});

// Danh sách Tier theo thứ tự ưu tiên
const tierOrder = ['S', 'A', '1', '2', '3', '4'];

// Hàm sắp xếp cầu thủ theo Tier
function sortPlayersByTier(players) {
    return players.sort((a, b) => {
        return tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier);
    });
}

// Hàm thêm cầu thủ và Tier từ Admin
function addPlayerToList() {
    const playerName = document.getElementById('adminPlayerName').value.trim();
    const playerTier = document.getElementById('adminPlayerTier').value.trim();

    if (playerName && playerTier) {
        const playerExists = players.find(player => player.name === playerName);
        if (!playerExists) {
            players.push({ name: playerName, tier: playerTier, attended: false });
            updateAdminPlayerList();
            localStorage.setItem('players', JSON.stringify(players)); // Lưu dữ liệu cầu thủ
        } else {
            alert("Player already exists!");
        }
    } else {
        alert("Please enter both name and tier!");
    }

    // Clear input fields
    document.getElementById('adminPlayerName').value = '';
    document.getElementById('adminPlayerTier').value = '';
}

// Hàm cập nhật danh sách cầu thủ cho Admin (đã sắp xếp theo Tier)
function updateAdminPlayerList() {
    const adminPlayerListBody = document.getElementById('adminPlayerList').getElementsByTagName('tbody')[0];
    adminPlayerListBody.innerHTML = ''; // Clear the table body

    // Sắp xếp cầu thủ theo Tier trước khi hiển thị
    const sortedPlayers = sortPlayersByTier(players);

    sortedPlayers.forEach(player => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        const tierCell = document.createElement('td');

        nameCell.textContent = player.name;
        tierCell.textContent = player.tier;

        row.appendChild(nameCell);
        row.appendChild(tierCell);
        adminPlayerListBody.appendChild(row);
    });

    // Update player select options for editing
    updatePlayerSelect();
}

// Hàm điểm danh cầu thủ
function markAttendance(playerName) {
    const player = players.find(p => p.name === playerName);
    if (player) {
        player.attended = !player.attended; // Toggle attendance
        updateAttendanceList();
        localStorage.setItem('players', JSON.stringify(players)); // Lưu trạng thái điểm danh
    }
}

// Hàm lọc cầu thủ đã điểm danh
function getAttendedPlayers() {
    return players.filter(player => player.attended);
}

// Hàm cập nhật danh sách điểm danh
function updateAttendanceList() {
    const attendanceList = document.getElementById('attendanceList');
    attendanceList.innerHTML = ''; // Xóa danh sách hiện tại

    players.forEach(player => {
        const li = document.createElement('li');
        li.textContent = player.name;  // Chỉ hiển thị tên cầu thủ

        // Thêm nút điểm danh cho mỗi cầu thủ
        const attendanceButton = document.createElement('button');
        attendanceButton.textContent = player.attended ? 'Attended' : 'Not Attended';
        attendanceButton.classList.toggle('attended', player.attended); // Đổi màu khi đã điểm danh
        attendanceButton.onclick = () => markAttendance(player.name); // Khi nhấn, toggle điểm danh
        li.appendChild(attendanceButton);

        attendanceList.appendChild(li); // Thêm vào danh sách
    });
}

// Hàm phân nhóm cầu thủ theo Tier
function groupByTier(players) {
    const grouped = {};
    players.forEach(player => {
        if (!grouped[player.tier]) {
            grouped[player.tier] = [];
        }
        grouped[player.tier].push(player);
    });
    return grouped;
}

// Hàm trộn ngẫu nhiên mảng
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Hoán đổi phần tử
    }
}

// Hàm chia đội với điều kiện không có cầu thủ cùng Tier trong một đội và chia random
function divideTeamsRandomly() {
    const attendedPlayers = getAttendedPlayers();
    if (attendedPlayers.length < 2) {
        alert("Not enough players to divide into teams!");
        return;
    }

    // Phân nhóm cầu thủ theo Tier
    const groupedPlayers = groupByTier(attendedPlayers);

    let team1 = [];
    let team2 = [];

    // Lặp qua từng Tier và chia cầu thủ vào hai đội
    for (let tier in groupedPlayers) {
        const playersInTier = groupedPlayers[tier];

        // Trộn ngẫu nhiên các cầu thủ trong Tier
        shuffleArray(playersInTier);

        // Chia cầu thủ cùng Tier vào 2 đội đều đặn
        for (let i = 0; i < playersInTier.length; i++) {
            if (i % 2 === 0) {
                team1.push(playersInTier[i]);
            } else {
                team2.push(playersInTier[i]);
            }
        }
    }

    // Sau khi chia đội, cập nhật giao diện
    displayTeams(team1, team2);
}

// Hàm hiển thị các đội lên giao diện
function displayTeams(team1, team2) {
    const teamList = document.getElementById('teamList');
    teamList.innerHTML = ''; // Xóa danh sách cũ

    // Tạo và hiển thị đội 1
    const team1Div = document.createElement('div');
    team1Div.classList.add('team');
    team1Div.innerHTML = '<h3>Team 1</h3>';
    team1.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.classList.add('player');
        playerDiv.textContent = player.name;
        team1Div.appendChild(playerDiv);
    });

    // Tạo và hiển thị đội 2
    const team2Div = document.createElement('div');
    team2Div.classList.add('team');
    team2Div.innerHTML = '<h3>Team 2</h3>';
    team2.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.classList.add('player');
        playerDiv.textContent = player.name;
        team2Div.appendChild(playerDiv);
    });

    // Thêm các đội vào trang
    teamList.appendChild(team1Div);
    teamList.appendChild(team2Div);
}

// Hàm lấy danh sách các cầu thủ đã điểm danh
function getAttendedPlayers() {
    return players.filter(player => player.attended);
}

// Hàm xóa các đội (Clear Teams)
function clearTeams() {
    team1 = [];
    team2 = [];
    displayTeams(team1, team2); // Cập nhật lại giao diện sau khi xóa các đội
}

// Gắn sự kiện cho nút "Clear Teams"
document.getElementById('clearTeamsBtn').addEventListener('click', clearTeams);

// Gắn sự kiện cho nút "Divide Teams"
document.getElementById('divideTeamsRandomly').addEventListener('click', divideTeamsRandomly);



// Hàm để reset điểm danh của tất cả cầu thủ
function resetAttendance() {
    players.forEach(player => {
        player.attended = false;  // Đặt lại trạng thái điểm danh của tất cả cầu thủ
    });
    displayAttendance(); // Cập nhật lại giao diện điểm danh
}

// Hàm hiển thị danh sách cầu thủ và trạng thái điểm danh
function displayAttendance() {
    const attendanceList = document.getElementById('attendanceList');
    attendanceList.innerHTML = ''; // Xóa danh sách cũ

    players.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.classList.add('player');

        // Tạo nút điểm danh (xanh/đỏ)
        const button = document.createElement('button');
        button.textContent = player.attended ? '✅' : '❌'; // Đổi biểu tượng tùy vào trạng thái điểm danh
        button.classList.add(player.attended ? 'attended' : 'not-attended');
        
        // Thêm sự kiện cho nút điểm danh
        button.addEventListener('click', () => {
            player.attended = !player.attended; // Đổi trạng thái điểm danh
            displayAttendance(); // Cập nhật lại giao diện
        });

        // Hiển thị tên cầu thủ và nút điểm danh
        const playerName = document.createElement('span');
        playerName.textContent = player.name;
        
        playerDiv.appendChild(playerName);
        playerDiv.appendChild(button);
        attendanceList.appendChild(playerDiv);
    });
}

// Gắn sự kiện cho nút "Xóa tất cả điểm danh"
document.getElementById('resetAttendanceBtn').addEventListener('click', resetAttendance);

// Gọi hàm hiển thị điểm danh ban đầu
displayAttendance();