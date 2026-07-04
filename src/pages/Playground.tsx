import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Badge } from '../components/badge';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/input';

// Playground temporal:
// Esta pantalla existe solo para practicar hooks. Mas adelante se puede borrar
// sin afectar el juego, porque la logica importante quedara documentada en
// docs/learning-notes.md.

function useToggle(initialValue = false) {
  // Hook propio:
  // Un hook propio es una funcion que empieza con "use" y puede usar otros hooks.
  // Sirve para reutilizar logica, no UI. Aqui reutilizamos una logica simple de
  // encendido/apagado que luego podria servir para modales, settings o ready state.
  const [enabled, setEnabled] = useState(initialValue);

  const toggle = useCallback(() => {
    setEnabled((currentValue) => !currentValue);
  }, []);

  const turnOn = useCallback(() => {
    setEnabled(true);
  }, []);

  const turnOff = useCallback(() => {
    setEnabled(false);
  }, []);

  return { enabled, toggle, turnOn, turnOff };
}

export function Playground() {
  // useState:
  // Guarda valores que, cuando cambian, deben volver a renderizar la pantalla.
  // Si el valor afecta lo que el usuario ve, normalmente es estado.
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState('Player 1');

  // useRef:
  // Guarda una referencia mutable que NO causa re-render cuando cambia.
  // Aqui lo usamos para apuntar al input y enfocarlo desde un boton.
  const nameInputRef = useRef<HTMLInputElement>(null);

  // useRef tambien sirve para recordar datos entre renders sin pintar nada.
  // Este contador aumenta cuando presionas "Focus Input", pero no se muestra
  // en pantalla porque cambiar un ref no provoca render.
  const focusCountRef = useRef(0);

  // Hook propio:
  // El componente no necesita saber como se implementa el toggle; solo usa su API.
  const {
    enabled: isTimerEnabled,
    toggle: toggleTimer,
    turnOff: turnOffTimer,
  } = useToggle(false);

  // useEffect:
  // Ejecuta efectos secundarios despues del render. Un efecto secundario es algo
  // que sale del calculo visual puro: timers, subscriptions, llamadas a APIs,
  // listeners del navegador, etc.
  useEffect(() => {
    if (!isTimerEnabled) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setScore((currentScore) => currentScore + 1);
    }, 1000);

    // Cleanup:
    // React llama esta funcion antes de repetir el efecto o desmontar el componente.
    // Es obligatorio limpiar timers/subscriptions para evitar fugas y bugs raros.
    return () => {
      window.clearInterval(intervalId);
    };
  }, [isTimerEnabled]);

  // useMemo:
  // Memoriza el resultado de un calculo. Se recalcula solo cuando cambian sus
  // dependencias. No es para todo: se usa cuando el calculo tiene costo o cuando
  // quieres derivar un valor de forma clara.
  const playerRank = useMemo(() => {
    if (score >= 20) {
      return 'Champion';
    }

    if (score >= 10) {
      return 'Contender';
    }

    return 'Rookie';
  }, [score]);

  const shotPower = useMemo(() => {
    return Math.min(100, score * 5);
  }, [score]);

  // useCallback:
  // Memoriza una funcion. Es util cuando pasas callbacks a componentes hijos o
  // cuando una funcion participa en dependencias de otro hook.
  const incrementScore = useCallback(() => {
    setScore((currentScore) => currentScore + 1);
  }, []);

  const resetScore = useCallback(() => {
    setScore(0);
    turnOffTimer();
  }, [turnOffTimer]);

  const focusNameInput = useCallback(() => {
    focusCountRef.current += 1;
    nameInputRef.current?.focus();
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
      <Card
        eyebrow="Playground"
        title="React hooks lab"
        description="Pantalla temporal para practicar estado, efectos, referencias, memoizacion y hooks propios."
        variant="highlight"
        footer={
          <div className="flex flex-wrap gap-2">
            <Badge variant="success" dot>
              {isTimerEnabled ? 'Timer activo' : 'Timer pausado'}
            </Badge>
            <Badge variant="gold">useRef listo</Badge>
          </div>
        }
      >
        <div className="flex flex-col gap-5">
          <Input
            ref={nameInputRef}
            label="Player name"
            value={playerName}
            onChange={setPlayerName}
            placeholder="Player 1"
            fullWidth
          />

          <div className="rounded-md border border-[var(--border)] bg-[rgba(255,255,255,0.04)] p-4">
            <p className="text-sm text-[var(--text-muted)]">Jugador</p>
            <p className="text-2xl font-bold text-[var(--color-gold-soft)]">
              {playerName}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Score" value={score} />
            <Stat label="Rank" value={playerRank} />
            <Stat label="Power" value={`${shotPower}%`} />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={incrementScore} fullWidth>
              +1 Score
            </Button>
            <Button variant="accent" onClick={toggleTimer} fullWidth>
              {isTimerEnabled ? 'Pause Timer' : 'Start Timer'}
            </Button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" onClick={focusNameInput} fullWidth>
              Focus Input
            </Button>
            <Button variant="ghost" onClick={resetScore} fullWidth>
              Reset
            </Button>
          </div>
        </div>
      </Card>

      <Card
        eyebrow="Tutorial"
        title="Que hace cada hook"
        description="Estas notas viven tambien en learning-notes.md para que no se pierdan cuando borremos el playground."
      >
        <div className="space-y-4 text-sm leading-6 text-[var(--text-muted)]">
          <HookNote
            name="useState"
            text="Guarda datos que afectan la UI. Cambiar estado provoca un nuevo render."
          />
          <HookNote
            name="useEffect"
            text="Corre efectos secundarios despues del render, como timers o llamadas externas."
          />
          <HookNote
            name="useMemo"
            text="Memoriza valores derivados para recalcularlos solo cuando cambian sus dependencias."
          />
          <HookNote
            name="useCallback"
            text="Memoriza funciones para mantener referencias estables entre renders."
          />
          <HookNote
            name="useRef"
            text="Guarda referencias mutables que no causan render, como un input o un contador interno."
          />
          <HookNote
            name="Hook propio"
            text="Extrae logica reutilizable a una funcion que empieza con use, como useToggle."
          />
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-[var(--border)] p-4 text-center">
      <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold text-[var(--color-gold-soft)]">
        {value}
      </p>
    </div>
  );
}

function HookNote({ name, text }: { name: string; text: string }) {
  return (
    <section>
      <h3 className="font-semibold text-[var(--color-gold-soft)]">{name}</h3>
      <p>{text}</p>
    </section>
  );
}
