export const leagueInviteEmail = (owner, link) => {
  return `
      <div>${owner} has invited you to join their DraftWars league! <a href="${link}">Click here</a> to view the invitation</div>
    `;
};
