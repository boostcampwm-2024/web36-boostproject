/* eslint-disable prettier/prettier */
import { RandomValueGenerator } from "./random-value-generator.interface";

const firstNames: string[] = [
  "김", "이", "박", "최", "정", "조", "윤", "장", "임", "한", "오", "서", "신", "권", "황", "안",
  "송", "류", "홍", "고", "문", "양", "손", "배", "조", "백", "허", "유", "남", "심", "노", "전",
  "하", "곽", "성", "차", "주", "우", "구", "민", "진", "강", "변", "방", "원", "신", "양", "현",
  "위", "맹", "기", "나", "복", "염", "천", "방", "공", "석", "시", "범", "팽", "두", "설", "소",
  "선", "도", "라", "탁", "마", "길", "표", "명", "장", "강", "반", "왕", "금", "옥", "육", "인",
  "맹", "제", "모", "장", "주", "제", "기", "남궁", "황보", "사공", "독고", "서문", "제갈", "여",
  "진", "탁", "량", "빈", "계", "복", "가", "간", "부", "설", "사", "채", "예", "원", "감", "장",
  "표", "낙", "탁", "연", "정"
];

const lastNames: string[] = [
  "지민", "민호", "지현", "우성", "수지", "예진", "윤서", "지훈", "다은", "현석",
  "성민", "서연", "진우", "윤아", "지영", "은지", "혜린", "채원", "영수", "수연",
  "예림", "재민", "진호", "한별", "세훈", "정우", "상윤", "지우", "민서", "소민",
  "태호", "서현", "도윤", "상민", "윤수", "하나", "가람", "진욱", "영지", "수정",
  "민호", "수아", "민준", "민주", "가은", "혜진", "다영", "상현", "채영", "은서",
  "수빈", "다희", "정민", "현우", "주영", "예빈", "하윤", "지아", "서윤", "채린",
  "지수", "은비", "하은", "수현", "민지", "도현", "아린", "시우", "성훈", "하린",
  "다현", "소영", "지후", "채희", "지한", "준영", "윤후", "희수", "다빈", "유진",
  "태윤", "승현", "정훈", "민혁", "지훈", "재윤", "서영", "혜림", "다연", "민정",
  "현서", "지완", "유림", "해린", "성호", "연우", "주하", "주원", "수영", "예지",
  "하준", "시현", "유나", "지완", "영훈", "해솔", "채윤", "현진", "예준", "승민",
  "시윤", "하늘", "정아", "미나", "가온", "다온", "예림", "수영", "채아", "서우",
  "예원", "현수", "선영", "아윤", "도영", "현준", "지인", "도연", "재혁", "승우",
  "하영", "민호", "은우", "윤호", "시훈", "지안", "승아", "민수", "준수", "태민",
  "하람", "혜원", "유빈", "수호", "은호", "도아", "서하", "예은", "해준", "시온",
  "도준", "민서", "서진", "시우", "재민", "하늘", "가희", "채현", "다은", "재원",
  "현아", "준희", "성진", "유선", "예진", "시영", "소민", "아현", "영진", "하진",
  "현수", "하준", "윤하", "태현", "승희", "지혁", "민희", "윤지", "정우", "지훈",
  "정민", "준호", "가온", "채온", "예나", "수린", "유미", "지혜", "하윤", "성현",
  "민택", "승훈"
];

export class NameGenerator extends RandomValueGenerator<string> {
  getRandomValue(): string {
    const firstNameIdx = Math.floor(Math.random() * firstNames.length);
    const lastNameIdx = Math.floor(Math.random() * lastNames.length);
    return firstNames[firstNameIdx] + lastNames[lastNameIdx];
  }
}