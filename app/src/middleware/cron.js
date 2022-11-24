import cron from 'node-cron';
import {
  checkInsertTeam,
  getAllUserNum,
  getLastTeamNum,
  insertTeam,
  insertTeamMember,
  checkThisInsertTeam,
  insertThisTeam

} from "../routes/bob_friend/bob_friend.ctrl.js";

export const SET_BOB_FRIEND = async (req, res, next) => {
  const resMessage = {}
  //res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
  const [checkThisSql] = await checkThisInsertTeam();
  const [checkSql] = await checkInsertTeam();
  const [userSql] = await getAllUserNum();

  // 이번주 밥친구 있어? 없음 만들고 아님 말고 다음주 확인해 다음주 있어

  // 이번주 밥친구 팀, 조가 생성되었는지 아닌지 확인하는 부분
  if(checkThisSql.length > 0) { // 이번주 밥친구가 있다.
    //res.write('이번주 밥친구가 이미 있습니다.')
    resMessage.thisWeek = "ERROR: 이미 이번주 밥친구가 만들어져 있습니다.";
  } else {
    if(userSql.length > 0) {
      const users = userSql.map(val => val.m_num).sort(() => Math.random() - 0.5); // 모든 회원의 n_num(랜덤으로 섞인) user배열에 담김
      const defCount = 4; // 기본으로 먹을 인원
      const teamCount = parseInt(users.length / defCount); // team 수 parseint 하면 소수 버림
      const restCount = users.length % defCount; // team 을 나누고 남은 나머지 인원

      const team = Array(teamCount) // team 배열 만듬
          .fill([]) // [ [], [], [], [], [] ]
          .reduce((acc, val, i) => {
            return [...acc, [users.splice(0, i < restCount ? 5 : 4)]]
          }, []);

      // 마지막으로 만들어진 team t_index 를 갖고옴.
      const [lastTeamSeq] = await getLastTeamNum();

      // 팀 생성 및 팀별유저 생성
      for(const [i, [t]] of team.entries()) { // [0,[]], [1,[]].....
        const tNum = lastTeamSeq[0].t_index + (i + 1); // 가장 마지막에 있는 t_index 값을 갖고와서 for 문 돌 때 마다 + 1
        await insertThisTeam(tNum); // 팀생성

        // 팀별 유저생성
        for (const tm of t) {
          await insertTeamMember(tNum, tm);
        }
      }
      resMessage.thisWeek = "이번주 밥친구 생성완료.";
    } else {
      resMessage.thisWeek = "밥친구를 만들 유저가 없습니다.";
    }
  }

  // 밥친구 팀, 조가 생성되었는지 아닌지 확인하는 부분
  if(checkSql.length > 0) {
    resMessage.nextWeek = 'ERROR: 이미 다음주 밥친구가 만들어져 있습니다.';
    console.log(JSON.stringify(resMessage));
    return false;
  }

  if(userSql.length > 0) {
    const users = userSql.map(val => val.m_num).sort(() => Math.random() - 0.5); // 모든 회원의 n_num(랜덤으로 섞인) user배열에 담김
    const defCount = 4; // 기본으로 먹을 인원
    const teamCount = parseInt(users.length / defCount); // team 수 parseint 하면 소수 버림
    const restCount = users.length % defCount; // team 을 나누고 남은 나머지 인원

    const team = Array(teamCount) // team 배열 만듬
      .fill([]) // [ [], [], [], [], [] ]
      .reduce((acc, val, i) => {
        return [...acc, [users.splice(0, i < restCount ? 5 : 4)]]
      }, []);

    // 마지막으로 만들어진 team t_index 를 갖고옴.
    const [lastTeamSeq] = await getLastTeamNum();

    // 팀 생성 및 팀별유저 생성
    for(const [i, [t]] of team.entries()) { // [0,[]], [1,[]].....
      const tNum = lastTeamSeq[0].t_index + (i + 1); // 가장 마지막에 있는 t_index 값을 갖고와서 for 문 돌 때 마다 + 1
      await insertTeam(tNum); // 팀생성

      // 팀별 유저생성
      for (const tm of t) {
        await insertTeamMember(tNum, tm);
      }
    }
    resMessage.nextWeek = '다음주 밥친구 생성완료.';
  } else {
    resMessage.thisWeek = "밥친구를 만들 유저가 없습니다.";
  }
  res.send(resMessage);
}

cron.schedule('0 0 * * 1', SET_BOB_FRIEND);