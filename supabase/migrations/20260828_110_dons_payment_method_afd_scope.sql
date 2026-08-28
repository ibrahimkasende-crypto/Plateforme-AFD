-- =============================================================================
-- Dons : alignement payment_method AFD (retrait SerdiPay du périmètre)
-- Additive — ne détruit aucune donnée métier.
-- =============================================================================

-- Historique éventuel : intentions stub SerdiPay → intent générique
update public.dons
set payment_method = 'intent'
where payment_method = 'serdipay';

alter table public.dons
  alter column payment_method set default 'bank_transfer';

drop policy if exists "Soumission publique intention de don limitée" on public.dons;
create policy "Soumission publique intention de don limitée"
on public.dons for insert to anon, authenticated
with check (
  status in ('pending', 'intent', 'proof_submitted')
  and amount > 0
  and coalesce(currency, '') in ('USD', 'CDF')
  and payment_method in ('bank_transfer', 'virement', 'card', 'intent')
  and (
    (donor_email is not null and char_length(donor_email) between 5 and 254)
    or true
  )
);
