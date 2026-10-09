/* Occasion briefs stay in the visitor's browser and download as plain text. */
document.querySelectorAll('[data-occasion-brief]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const lines = [
      'SEATTLE EVENT GROUP — MY EVENT BRIEF',
      '',
      `Occasion: ${form.dataset.occasionBrief}`,
      `Preferred date: ${values.get('date') || 'Still deciding'}`,
      `Guest count: ${values.get('guests') || 'Still deciding'}`,
      `The feeling: ${values.get('feeling')}`,
      '',
      'A starting point for planning your celebration.',
      'This brief has been saved to your device. It has not been submitted to Seattle Event Group.',
      'Booking details are coming soon at https://seattleeventgroup.com/#connect.'
    ];
    const file = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${form.dataset.filename}-event-brief.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    form.querySelector('[role="status"]').textContent = 'Your brief is saved. Keep it for your planning conversation.';
  });
});
