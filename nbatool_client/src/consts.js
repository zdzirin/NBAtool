export const ABBREVIATION_TO_TEAM = {
    ATL: "Atlanta Hawks",
    BOS: "Boston Celtics",
    BRK: "Brooklyn Nets",
    CHO: "Charlotte Hornets",
    CHI: "Chicago Bulls",
    CLE: "Cleveland Cavaliers",
    DAL: "Dallas Mavericks",
    DEN: "Denver Nuggets",
    DET: "Detroit Pistons",
    GSW: "Golden State Warriors",
    HOU: "Houston Rockets",
    IND: "Indiana Pacers",
    LAC: "Los Angeles Clippers",
    LAL: "Los Angeles Lakers",
    MEM: "Memphis Grizzlies",
    MIA: "Miami Heat",
    MIL: "Milwaukee Bucks",
    MIN: "Minnesota Timberwolves",
    NOP: "New Orleans Pelicans",
    NYK: "New York Knicks",
    OKC: "Oklahoma City Thunder",
    ORL: "Orlando Magic",
    PHI: "Philadelphia 76ers",
    PHO: "Phoenix Suns",
    POR: "Portland Trail Blazers",
    SAC: "Sacramento Kings",
    SAS: "San Antonio Spurs",
    TOR: "Toronto Raptors",
    UTA: "Utah Jazz",
    WAS: "Washington Wizards",
};

export const colors = {
    logo_pale: "#D0B9AC",
    logo_brown: "#553D38",
    logo_orange: "#D54F42",
    green: "#0B6E4F",
    yellow_orange: "#E6A340",
    almostWhite: "#e7e0da",
};

export const getYearForResults = () => {
    // get the current year and add a 1 to it if the month is october or later
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    return currentMonth >= 9 ? currentYear + 1 : currentYear;
};
