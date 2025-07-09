interface SettingsFormData {
  pixKey: string;
  pixName: string;
  pixCity: string;
  // Add other fields as needed, for example:
  // paypal: string;
}

interface PaymentSettingsFormProps {
  pixKey: string;
  pixName: string;
  pixCity: string;
  onUpdateField: (field: keyof SettingsFormData, value: string) => void;
}

export function PaymentSettingsForm({
  pixKey,
  pixName, 
  pixCity,
  onUpdateField,
}: PaymentSettingsFormProps) {
  return (
    <article className="border border-[var(--soft-presence)] bg-[var(--bg-secondary)] p-6 rounded-xl">
      <h2 className="text-[var(--bright-azure)] text-xl font-semibold mb-4">
        Configurações de Pagamento
      </h2>
      <p className="text-[var(--soft-cyan)] text-sm mb-4">
        Configure como receber apoios
      </p>
      
      <div
      className="grid gap-2 md:grid-cols-2">
          <div>
            <label className="text-[var(--soft-cyan)] text-sm font-semibold">
              Chave PIX
            </label>
            <input
              type="text"
              value={pixKey}
              onChange={(e) => onUpdateField("pixKey", e.target.value)}
              className="w-full p-3 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none text-sky-100 mt-1"
              placeholder="Digite sua chave PIX"
            />
          </div>

          <div>
            <label className="text-[var(--soft-cyan)] text-sm font-semibold">
              Nome completo
            </label>
            <input
              type="text"
              value={pixName}
              onChange={(e) => onUpdateField("pixName", e.target.value)}
              className="w-full p-3 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none text-sky-100 mt-1"
              placeholder="Digite seu nome completo"
            />
            </div>
        
            <div>
              <label className="text-[var(--soft-cyan)] text-sm font-semibold">
                Cidade
              </label>
            <input
              type="text"
              value={pixCity}
              onChange={(e) => onUpdateField("pixCity", e.target.value)}
              className="w-full p-3 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none text-sky-100 mt-1"
              placeholder="Digite sua cidade"
            />
            </div>
        
          <div>
            <label className="text-[var(--soft-cyan)] text-sm font-semibold">
              PayPal
            </label>
            <input
              type="email"
              placeholder="Digite seu email do PayPal"
              className="w-full p-3 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none text-sky-100 mt-1"
            />
          </div>
      </div>
    </article>
  );
}