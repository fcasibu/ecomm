export default function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = params.then((p) => p.locale);

  return;
}
